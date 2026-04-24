---
name: project-showcase
description: Interview the project author, crawl the repo, gather screenshots, and produce a project writeup at src/content/projects/. Use when asked to showcase, write up, update, or add a project to the site.
---

# project-showcase

Produces two files per project:

1. **Interview notes** — `.agents/skills/project-showcase/interviews/<slug>.md` (source of truth, not published)
2. **Project writeup** — `src/content/projects/<slug>.md` (published)

The writeup should be a concise, high-quality project overview drawn from the notes — not a narrative essay and not a dump of the transcript.

## Desired writeup shape

Default to a scannable, matter-of-fact format unless the user explicitly asks for a more personal essay.

Recommended structure:

```markdown
Opening paragraph: what it is, who it is for, current state.

## Problem
## Solution
## What I built
## Technical architecture
## Product decisions
## Agent-assisted development   # only if agents were materially used
## Current status
## What I learned
```

Guidelines:

- Prefer bullets and short paragraphs over long narrative sections.
- Make the value obvious to a busy reader in the first screen.
- Tie features to problems solved; avoid feature lists with no context.
- Include technical specificity: stack, architecture, infrastructure, integrations, platform surfaces, testing/deployment approach.
- Include product judgment: trade-offs, what was moved deeper, what was cut, what was deliberately not built.
- Include learning and ownership signals that make the work understandable: domain modeling, scope control, debugging, deployment, feedback loops, maintainability.
- Use first person sparingly and concretely. Prefer “I built…” / “I moved…” / “I learned…” over memoir-style prose.
- Do not invent metrics, users, outcomes, or business traction. Ask or omit.

## Workflow

Run in order.

### 1. Crawl before asking

Before starting the interview, read what the project already tells you:

- `README.md`
- `AGENTS.md` / `CLAUDE.md` if present
- `package.json` / `go.mod` / `Cargo.toml` / `Podfile` — for stack
- Top-level file structure, 1–2 levels deep
- `.github/workflows/*` — for CI / deployment signals
- Deployment files (`Dockerfile`, `docker-compose*.yml`, `fly.toml`, `vercel.json`, `railway.json`, `terraform`, etc.)
- Storage/media integrations, auth, payments, background jobs, and other major services if visible in code
- Any existing writeup at `src/content/projects/<slug>.md`
- Any existing interview notes at `.agents/skills/project-showcase/interviews/<slug>.md`

Summarize to yourself what you already know. Skip interview questions the code has already answered, but verify anything that looks stale or ambiguous.

### 2. Interview — conversational capture

Have a conversation. Don't march through a question list, but make sure the notes capture enough material for the case-study structure.

- Follow interesting threads instead of interrupting to hit the next topic.
- Ask follow-ups when something is vague, interesting, or surprising.
- Tangents often contain the best material — capture them.
- If an answer is short and you sense there's more, probe once, then move on.
- Ask for concrete examples whenever possible: “What was a screen or feature where this trade-off showed up?”

Topics to get to eventually (not in order, not all required — skip what doesn't apply):

- **Pitch** — a 30-second plain description of what this is and who it's for.
- **Problem** — what pain point exists, who feels it, what current tools/workarounds miss.
- **Solution** — the product’s approach, what makes it different, why this shape solves the problem.
- **What was built** — major user-facing features, platforms/mediums (web, mobile, desktop, CLI, etc.), integrations, workflows, admin/internal surfaces.
- **Architecture** — stack, app surfaces, data model, infrastructure, storage/media, auth, payments, deployment, testing.
- **Interfaces and automation** — if there is a CLI/API/import/export/tooling surface, ask who it is for, whether it is scriptable, and whether it was designed for agents or other automation.
- **Product decisions and trade-offs** — what was picked, rejected, hidden, moved deeper, cut, or simplified.
- **Hard parts** — problems encountered and how they were resolved (or aren't yet).
- **Agents vs. manual** — what was delegated to agents, what guardrails existed, what stayed human-owned, and whether the product itself includes agent-facing affordances.
- **Learnings** — what surprised, what would be done differently, how the project changed the builder’s process.
- **Current status** — live/private/wip, testers/customers, roadmap, active unknowns, what is next.
- **Evidence** — real metrics, screenshots, links, demos, testimonials, or concrete artifacts. If none, omit.
- **Visuals** — what to screenshot, what captions matter.

Append answers to the notes file as the conversation goes. Light inline tagging is fine; don't force structure yet.

### 3. Cleanup pass — organize

At the end of the interview, reorganize the notes into standard H2 sections so later drafts can parse them:

```markdown
# Project Interview: <Title>

## Pitch
## Problem
## Solution
## What I built
## Architecture
## Interfaces & automation
## Product decisions & trade-offs
## Hard parts
## Agents vs. manual
## Current status
## Learnings
## Visuals
## Notes
```

- Merge repeated or related points.
- Keep specificity; don't paraphrase away interesting detail.
- Anything that doesn't fit a standard section goes under `## Notes`.
- If a section had nothing in the conversation, omit it or leave `—`.
- Do not add material that wasn't in the conversation or code crawl.
- Mark code-crawl facts separately from interview answers if they were inferred from the repo.
- Show the reorganized file for review before proceeding.

### 4. Screenshots

Branch on platform:

- **Web** → Chrome DevTools MCP
- **iOS** → XcodeBuildMCP in the project repo
- **CLI** → VHS (`.tape` → GIF) for flows; `freeze` for stills
- **Desktop / other** → ask for a manual capture

Save the hero image and screenshots alongside the writeup at `src/content/projects/`:

- `<slug>.md`
- `<slug>-hero.<ext>` (or a `<slug>/` subfolder if many images)
- additional screenshots as needed

Set the `image` frontmatter field to the hero. Reference inline screenshots in the body with `![alt](./...)`.

### 5. Draft the writeup

Using the organized notes:

1. Ask which topics or points should make it into the writeup. Cutting is expected — a writeup is a focused case study, not a transcript.
2. Use the recommended case-study structure unless the project clearly needs a different shape.
3. Open with 2–3 sentences: what it is, who it's for, and current state.
4. Draft in short paragraphs and bullets. Make it easy to skim.
5. Include a “Technical architecture” section with concrete stack and infrastructure details.
6. Include a “Product decisions” section for trade-offs and judgment.
7. Include an “Agent-assisted development” section only if agents were materially used. Describe guardrails, verification, and what stayed human-owned.
8. Close with current status and/or learnings, not a generic summary.

Draft, show, iterate, then save. Don't publish silently.

### 6. Frontmatter

Fill in the schema from `src/content/config.ts`:

```yaml
---
title: "Project Name"
description: "One-line hook. What it is, for whom."
publishDate: 2026-04-17
technologies: ["TypeScript", "..."]
url: "https://..."             # optional
github: "lukemelnik/..."       # optional
image: "./<slug>-hero.png"
role: "solo"                   # solo | lead | contributor
status: "shipped"              # shipped | wip | archived
draft: true
tags: ["projects"]
---
```

Keep `draft: true` until the writeup is approved.

### 7. Re-runs

If notes or a writeup already exist:

- Read existing notes; summarize what's captured.
- Interview only about what's new, stale, or missing — don't repeat old ground.
- Verify ambiguous stack/infrastructure details against the repo when possible.
- Append to or update the same notes file; re-run the cleanup pass.
- When redrafting the writeup, preserve existing edited prose unless asked to rewrite.

## Rules

- **Do not fabricate.** If a metric, user count, technology, or outcome wasn't stated or isn't in the code, it doesn't go in the writeup. Ask or omit.
- **Do not commit or push.** Leave changes unstaged unless the user asks otherwise.
- **Do not dump notes into the writeup.** The notes file exists so the writeup doesn't need to contain everything.
- **Do not over-narrate by default.** The default output should be clear, structured, and easy to scan.

## File locations

```text
lukemelnik-web/
├── .agents/skills/project-showcase/
│   ├── SKILL.md
│   └── interviews/
│       └── <slug>.md
└── src/content/projects/
    ├── <slug>.md
    ├── <slug>-hero.<ext>
    └── <slug>/
        └── *.png
```

## Reference

- Site-wide conventions and voice: `AGENTS.md` at repo root
- Content schema: `src/content/config.ts`
- Layout the writeup renders into: `src/layouts/Project.astro`
