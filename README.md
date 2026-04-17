# lukemelnik

Luke Melnik's personal website. Blog, projects, and recipes.

**Live:** [lukemelnik.ca](https://lukemelnik.ca)

## Stack

- [Astro 5](https://astro.build) + [React 19](https://react.dev) (islands only)
- [Tailwind CSS v4](https://tailwindcss.com) with a [Kanagawa](https://github.com/rebelot/kanagawa.nvim) palette
- [MDX](https://mdxjs.com) + [remark-callout](https://github.com/r4ai/remark-callout)
- [Fuse.js](https://www.fusejs.io) for recipe search
- [Vitest](https://vitest.dev) for unit tests
- pnpm
- Deployed on [Cloudflare Pages](https://pages.cloudflare.com)

## Running locally

```bash
pnpm install
pnpm dev         # astro dev
pnpm build       # astro build
pnpm preview     # astro preview
pnpm test        # vitest run
```

## Project structure

```
src/
├── components/     # Astro + React components
├── content/
│   ├── blog/       # Essays, served at /<slug>
│   ├── projects/   # Project writeups
│   ├── recipes/    # Recipes with structured ingredients
│   └── config.ts   # Collection schemas
├── layouts/        # BlogPost, Project, Recipe, BaseLayout
├── pages/          # Routes
├── styles/         # Global CSS + theme
└── utils/          # Unit-conversion + recipe math helpers
.agents/skills/     # Project-local agent workflows (project-showcase)
.claude/skills → .agents/skills
.mcp.json           # MCP server config (chrome-devtools, XcodeBuildMCP, playwriter)
```

## License

Code is MIT. Content (blog posts, recipes, images) is copyrighted.
