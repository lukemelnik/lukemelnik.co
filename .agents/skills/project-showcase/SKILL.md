---
name: project-showcase
description: Interview the project author, crawl the repo, gather screenshots, and produce a project writeup at src/content/projects/. Use when asked to showcase, write up, update, or add a project to the site.
---

# project-showcase

Produces two files per project:

1. **Interview notes** — `.agents/skills/project-showcase/interviews/<slug>.md` (source of truth, not published)
2. **Project writeup** — `src/content/projects/<slug>.md` (published)

The writeup is a narrative drawn from the notes, not a dump of them.

## Workflow

Run in order.

### 1. Crawl before asking

Before starting the interview, read what the project already tells you:

- `README.md`
- `AGENTS.md` / `CLAUDE.md` if present
- `package.json` / `go.mod` / `Cargo.toml` / `Podfile` — for stack
- Top-level file structure, 1–2 levels deep
- `.github/workflows/*` — for CI / deployment signals
- Any existing writeup at `src/content/projects/<slug>.md`
- Any existing interview notes at `.agents/skills/project-showcase/interviews/<slug>.md`

Summarize to yourself what you already know. Skip interview questions the code has already answered.

### 2. Interview — conversational capture

Have a conversation. Don't march through a question list.

- Follow interesting threads instead of interrupting to hit the next topic
- Ask follow-ups when something is vague, interesting, or surprising
- Tangents often contain the best material — capture them
- If an answer is short and you sense there's more, probe once, then move on

Topics to get to eventually (not in order, not all required — skip what doesn't apply):

- **Pitch** — a 30-second plain description of what this is and who it's for
- **Origin** — what started it; prior pain point or attempt that led here
- **Hard parts** — problems encountered and how they were resolved (or aren't yet)
- **Technical choices and trade-offs** — what was picked, what was rejected, why
- **Architecture** — only if non-obvious or genuinely interesting
- **Agents vs. manual** — what was delegated to agents, what was kept manual
- **Learnings** — what surprised, what would be done differently
- **What's still open** — active unknowns, roadmap, things still stuck on
- **Visuals** — what to screenshot, what captions matter

Append answers to the notes file as the conversation goes. Light inline tagging is fine; don't force structure yet.

### 3. Cleanup pass — organize

At the end of the interview, reorganize the notes into standard H2 sections so later drafts can parse them:

```markdown
# Project Interview: <Title>

## Pitch
## Origin
## Hard parts
## Technical choices & trade-offs
## Architecture
## Agents vs. manual
## Learnings
## What's still open
## Visuals
## Notes
```

- Merge repeated or related points
- Keep specificity; don't paraphrase away interesting detail
- Anything that doesn't fit a standard section goes under `## Notes`
- If a section had nothing in the conversation, omit it or leave `—`
- Do not add material that wasn't in the conversation
- Show the reorganized file for review before proceeding

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

1. Ask which topics or points should make it into the writeup. Cutting is expected — a writeup is narrative, not a transcript.
2. Propose a heading structure driven by the project's own story, not a template. Good headings name the real beats of what happened — e.g., "The problem from a decade in the industry," "Why I'm building this solo," "Where agents earned their keep." Avoid "Overview / Features / Tech stack / Conclusion."
3. Draft the prose. Specific verbs. Real numbers. First person.
4. Open with 2–3 sentences of overview — what it is, who it's for, current state.
5. Include a "How agents were used" section only if agents were actually used. Describe what was delegated and what was kept manual.
6. Close with something real — what's next, what's open, what was learned. Not a summary.

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

- Read existing notes; summarize what's captured
- Interview only about what's new or updated — don't repeat old ground
- Append to the same notes file; re-run the cleanup pass
- When redrafting the writeup, preserve existing edited prose unless asked to rewrite

## Rules

- **Do not fabricate.** If a metric, user count, technology, or outcome wasn't stated or isn't in the code, it doesn't go in the writeup. Ask or omit.
- **Do not commit or push.** Leave changes staged for review.
- **Do not dump notes into the writeup.** The notes file exists so the writeup doesn't need to contain everything.

## File locations

```
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
