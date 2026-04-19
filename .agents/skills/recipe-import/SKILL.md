---
name: recipe-import
description: Import a recipe from an external URL into this site's `src/content/recipes/` collection. Use when asked to grab a recipe from the web, format it like the site's existing recipes, preserve source attribution, or turn a recipe page into a clean markdown content file.
---

# Recipe Import

Turn a recipe URL into a concise markdown recipe entry for this repo.

## Workflow

1. Confirm the recipe schema if needed.
   - Prefer the existing recipe files in `src/content/recipes/` as the primary examples.
   - If there is any doubt about allowed frontmatter fields or units, check `src/content/config.ts`.
2. Fetch the recipe page.
3. Extract only the useful recipe data:
   - title
   - short rewritten description
   - ingredients
   - ingredient sections if the source already groups them
   - concise rewritten instructions
   - source URL
   - genuinely useful notes like apple choice, bake time, storage, or serving suggestions
4. Create a new file in `src/content/recipes/<slug>.md`.
5. Add attribution in `## Notes`.
   - Use `Adapted from [Source](URL)` when the instructions are rewritten.
   - Do not paste the article intro, story, or long explanatory prose.

## Repo format

Use only these frontmatter fields unless the schema has changed:
- `title`
- `description`
- `publishDate`
- `familyRecipe`
- `ingredients`
- `bread`
- `draft`
- `tags`
- `image`

Supported units:
- `cup`, `tbsp`, `tsp`
- `oz`, `lb`
- `g`, `kg`, `ml`, `l`
- `whole`, `can`, `clove`, `cloves`, `full`, `small`, `large bowl`

If a source uses something outside that list, omit the unit and put the detail in `note`.

## Content rules

- Match the tone of the existing recipes: short, practical, no fluff.
- Rewrite descriptions and instructions in your own words.
- Keep ingredient lists factual and clean.
- Use sectioned ingredients only when the source naturally has sections like `Filling` and `Topping`.
- Prefer a short `## Notes` block over stuffing detail into the description.
- Do not change the schema just to fit one recipe.

## Template

```md
---
title: Recipe Name
description: Short practical summary.
publishDate: YYYY-MM-DD
tags:
  - tag
ingredients:
  - name: ingredient
    quantity: 1
    unit: cup
    note: optional
---

## Notes

- Adapted from [Source](URL)

## Instructions

- Step 1
- Step 2
```

## Fast path

For routine imports, you usually only need:
- one representative recipe file from `src/content/recipes/`
- the external recipe page
- a new markdown file in `src/content/recipes/`

Avoid spinning up extra structure, references, or scripts unless the user specifically asks for automation.
