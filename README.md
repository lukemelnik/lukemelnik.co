# lukemelnik.co

Personal site and digital garden. Blog posts, software projects, and recipes with metric/imperial unit conversion.

**Live:** [lukemelnik.co](https://lukemelnik.co)

## Stack

- [Astro](https://astro.build) + [React](https://react.dev)
- [Tailwind CSS v4](https://tailwindcss.com) with [Kanagawa](https://github.com/rebelot/kanagawa.nvim) color theme
- [MDX](https://mdxjs.com) for content
- [Fuse.js](https://www.fusejs.io) for search
- Deployed on [Cloudflare Pages](https://pages.cloudflare.com)

## Running locally

```bash
npm install
npm run dev
```

Other commands:

| Command           | Description          |
| ----------------- | -------------------- |
| `npm run build`   | Build for production |
| `npm run preview` | Preview build        |

## Project structure

```
src/
├── content/
│   ├── blog/       # Blog posts (Markdown/MDX)
│   ├── recipes/    # Recipes with structured ingredients
│   └── projects/   # Project showcases
├── components/     # Astro & React components
├── layouts/        # Page layouts
├── pages/          # Routes
├── utils/          # Unit conversion helpers
└── styles/         # Global CSS & theme
```

## License

Content (blog posts, recipes, images) is copyrighted. Code is MIT.
