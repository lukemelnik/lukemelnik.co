# lukemelnik — Agent Instructions

Personal website. Astro static site with blog, projects, and recipes.

## Stack

- Astro 5 (static site, minimal JS)
- React 19 (islands only, `client:*` directives)
- Tailwind CSS 4 (via `@tailwindcss/vite`)
- TypeScript
- Content Collections (`blog`, `projects`, `recipes`) defined in `src/content/config.ts`
- pnpm
- Vitest for unit tests

## Commands

```bash
pnpm install
pnpm dev         # astro dev
pnpm build       # astro build
pnpm preview     # astro preview
pnpm test        # vitest run
pnpm test:watch  # vitest
```

## Content model

Three collections in `src/content/`:

- `blog/` — essays. Index lives at `/writing`; individual posts live at the root (`/<slug>`). The collection is still named `blog` internally (schema, directory).
- `projects/` — project writeups. Each project is one markdown file plus colocated images. Lives under `/projects`.
- `recipes/` — recipes. Lives under `/recipes`.

Legacy `/blog` and `/blog/<slug>` URLs redirect to `/writing` and `/<slug>` via `redirects` in `astro.config.mjs`. When adding a new blog post, check the slug does not collide with a top-level route (`/about`, `/projects`, `/recipes`, `/writing`).

Canonical schemas live in `src/content/config.ts`. Read that file before adding or modifying frontmatter.

## Skills

Agent-driven workflows live in `.agents/skills/`. `.claude/skills` is a symlink to `.agents/skills`.

- `project-showcase` — interview about a project, crawl its repo, gather screenshots, and produce a writeup in `src/content/projects/`.

## MCP servers

Configured in `.mcp.json`:

- `chrome-devtools` — web screenshots
- `XcodeBuildMCP` — iOS screenshots
- `playwriter` — alternative web browser automation

## File layout

```
src/
  components/
  content/
    blog/
    projects/
    recipes/
    config.ts          # collection schemas
  layouts/
  pages/
  styles/
  utils/
public/
.agents/skills/        # project-local agent skills
.claude/skills -> .agents/skills
.mcp.json
astro.config.mjs
```

## Conventions

- Images are colocated with content.
- Use Astro's `astro:assets` for images.
- `draft: true` hides content in production.
- No Tailwind `@apply`; use utility classes directly.
- Icons: `lucide-astro` in `.astro` files, `lucide-react` in React components.

## Anti-patterns

- Do not add new collections or new frontmatter fields ad hoc. Update `src/content/config.ts` deliberately, then use the field.
- Do not commit draft blog posts unless the user explicitly asks. If `src/content/blog/*` files are in draft, leave them unstaged by default.
- Do not push, deploy, or open PRs unless asked.
