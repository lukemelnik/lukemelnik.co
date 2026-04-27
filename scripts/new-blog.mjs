#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, readdir, writeFile } from "node:fs/promises";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const repoRoot = fileURLToPath(new URL("..", import.meta.url));
const blogDir = join(repoRoot, "src/content/blog");
const pagesDir = join(repoRoot, "src/pages");

const booleanFlags = new Set([
  "draft",
  "dry-run",
  "featured",
  "help",
  "no-open",
  "open",
  "publish",
]);

const aliases = {
  d: "description",
  h: "help",
  s: "slug",
  t: "title",
};

function parseArgs(argv) {
  const options = { _: [] };

  for (let index = 0; index < argv.length; index += 1) {
    const rawArg = argv[index];

    if (rawArg === "--") {
      // pnpm forwards a standalone "--" to scripts; skip it and keep parsing flags.
      continue;
    }

    if (!rawArg.startsWith("-")) {
      options._.push(rawArg);
      continue;
    }

    const isLongFlag = rawArg.startsWith("--");
    const flagText = rawArg.slice(isLongFlag ? 2 : 1);
    const [rawName, inlineValue] = flagText.split(/=(.*)/s, 2);
    const name = aliases[rawName] ?? rawName;

    if (booleanFlags.has(name)) {
      options[name] =
        inlineValue === undefined ? true : parseBoolean(inlineValue, true);
      continue;
    }

    const nextArg = argv[index + 1];
    if (inlineValue !== undefined) {
      options[name] = inlineValue;
    } else if (nextArg !== undefined && !nextArg.startsWith("-")) {
      options[name] = nextArg;
      index += 1;
    } else {
      options[name] = true;
    }
  }

  return options;
}

function printHelp() {
  console.log(`Create a new blog draft in src/content/blog.

Usage:
  pnpm blog
  pnpm blog "Post title"
  pnpm blog "Post title" -- --description "One-line summary"

Default behavior:
  - prompts for title and description when no title is passed
  - creates a draft markdown file with today's date
  - generates the slug from the title
  - opens the new file in $VISUAL/$EDITOR, or macOS open, when run in a terminal

Options:
  -t, --title <title>             Post title; positional title also works
  -d, --description <text>        One-line summary; defaults to empty on fast path
  -s, --slug <slug>               URL slug; defaults to a slugified title
      --date <YYYY-MM-DD>         Publish date; defaults to today
      --tags <a,b,c>              Comma-separated tags
      --publish                   Omit draft: true
      --featured                  Add featured: true
      --cover <path>              Optional colocated cover image path, e.g. ./cover.png
      --alt <text>                Alt text for --cover
      --no-open                   Do not open the new file after creating it
      --open                      Open even when not run from a TTY
      --dry-run                   Print the file that would be created without writing it
  -h, --help                      Show this help

Examples:
  pnpm blog
  pnpm blog "Pessimism Isn't Genius"
  pnpm blog "A Shipped Post" -- --description "Ready to publish." --publish
`);
}

function parseBoolean(value, defaultValue = false) {
  if (typeof value === "boolean") return value;
  if (typeof value !== "string" || value.trim() === "") return defaultValue;

  const normalized = value.trim().toLowerCase();
  if (["1", "true", "t", "yes", "y", "on"].includes(normalized)) return true;
  if (["0", "false", "f", "no", "n", "off"].includes(normalized)) return false;

  return defaultValue;
}

function slugify(value) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function todayLocal() {
  const now = new Date();
  const timezoneOffset = now.getTimezoneOffset() * 60_000;
  return new Date(now.getTime() - timezoneOffset).toISOString().slice(0, 10);
}

function isValidDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return (
    !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
  );
}

function parseTags(value) {
  if (Array.isArray(value)) return value;
  if (typeof value !== "string") return [];

  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function yamlString(value) {
  return JSON.stringify(value);
}

function formatTags(tags) {
  return `[${tags.map(yamlString).join(", ")}]`;
}

function renderPost({
  alt,
  cover,
  description,
  draft,
  featured,
  publishDate,
  tags,
  title,
}) {
  const frontmatter = [
    "---",
    `title: ${yamlString(title)}`,
    `description: ${yamlString(description)}`,
    `publishDate: ${publishDate}`,
    draft ? "draft: true" : null,
    tags.length > 0 ? `tags: ${formatTags(tags)}` : null,
    featured ? "featured: true" : null,
    cover ? `cover: ${yamlString(cover)}` : null,
    alt ? `alt: ${yamlString(alt)}` : null,
    "---",
  ].filter((line) => line !== null);

  return `${frontmatter.join("\n")}\n\n`;
}

async function getReservedRootSlugs() {
  const reserved = new Set(["blog"]); // Legacy /blog redirects to /writing.

  let entries = [];
  try {
    entries = await readdir(pagesDir, { withFileTypes: true });
  } catch {
    return reserved;
  }

  for (const entry of entries) {
    if (entry.name.startsWith("[")) continue;

    const routeName = entry.isDirectory()
      ? entry.name
      : entry.name.replace(/\.(astro|md|mdx|js|jsx|ts|tsx)$/u, "");

    if (routeName && routeName !== "index" && !routeName.startsWith("[")) {
      reserved.add(routeName);
    }
  }

  return reserved;
}

function slugProblem(slug, reservedSlugs) {
  if (!slug) return "Slug cannot be empty.";
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return "Slug must contain lowercase letters, numbers, and single hyphens only.";
  }
  if (reservedSlugs.has(slug)) {
    return `/${slug} is already a top-level route or redirect.`;
  }
  if (
    existsSync(join(blogDir, `${slug}.md`)) ||
    existsSync(join(blogDir, `${slug}.mdx`))
  ) {
    return `A blog post already exists for slug "${slug}".`;
  }
  return null;
}

async function promptText({ ask, label, required = false }) {
  while (true) {
    const answer = (await ask(`${label}: `)).trim();

    if (answer || !required) return answer;
    console.log(`  ${label} is required.`);
  }
}

async function buildPostOptions(options) {
  const reservedSlugs = await getReservedRootSlugs();
  const positionalTitle = options._.join(" ").trim();
  const providedTitle =
    typeof options.title === "string" ? options.title.trim() : positionalTitle;
  const needsPrompt = !providedTitle;
  const rl =
    needsPrompt && input.isTTY
      ? readline.createInterface({ input, output })
      : null;
  const ask = (question) => rl.question(question);

  try {
    let title = providedTitle;
    let description =
      typeof options.description === "string" ? options.description.trim() : "";

    if (!title && rl) {
      title = await promptText({ ask, label: "Title", required: true });
      description = await promptText({ ask, label: "Description" });
    }

    if (!title)
      throw new Error(
        'Missing title. Run `pnpm blog` for prompts or `pnpm blog "Post title"`.',
      );

    const publishDate =
      typeof options.date === "string" && options.date.trim()
        ? options.date.trim()
        : todayLocal();
    if (!isValidDate(publishDate))
      throw new Error("Invalid --date. Use YYYY-MM-DD.");

    const slug = slugify(options.slug || title);
    const problem = slugProblem(slug, reservedSlugs);
    if (problem) throw new Error(problem);

    const cover = typeof options.cover === "string" ? options.cover.trim() : "";
    const alt = typeof options.alt === "string" ? options.alt.trim() : "";
    if (cover && !alt) throw new Error("Missing --alt for --cover.");

    return {
      alt,
      cover,
      description,
      draft: options.publish ? false : true,
      featured: parseBoolean(options.featured, false),
      publishDate,
      slug,
      tags: parseTags(options.tags),
      title,
    };
  } finally {
    rl?.close();
  }
}

function relativeToRepo(path) {
  return relative(repoRoot, path);
}

function openInEditor(filePath) {
  const editor = process.env.VISUAL || process.env.EDITOR;
  const command = editor || (process.platform === "darwin" ? "open" : "");

  if (!command) {
    console.log("No $VISUAL or $EDITOR is set; open the file manually.");
    return;
  }

  const result = spawnSync(command, [filePath], {
    shell: Boolean(editor),
    stdio: "inherit",
  });

  if (result.error) {
    console.error(`Could not open editor: ${result.error.message}`);
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2));

  if (options.help) {
    printHelp();
    return;
  }

  const post = await buildPostOptions(options);
  const filePath = join(blogDir, `${post.slug}.md`);
  const content = renderPost(post);

  if (options["dry-run"]) {
    console.log(`Would create ${relativeToRepo(filePath)}:\n`);
    console.log(content);
    return;
  }

  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, content, { flag: "wx" });

  console.log(`Created ${relativeToRepo(filePath)}`);
  console.log(`URL: /${post.slug}`);
  if (post.draft) console.log("Draft: true (hidden in production)");

  const shouldOpen = options.open || (!options["no-open"] && input.isTTY);
  if (shouldOpen) {
    openInEditor(filePath);
  }
}

main().catch((error) => {
  console.error(`\n${error.message}`);
  process.exitCode = 1;
});
