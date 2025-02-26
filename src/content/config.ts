import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  loader: glob({ pattern: ["*.md", "*.mdx"], base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.date(),
    draft: z.boolean().optional(),
    tags: z.array(z.string()).optional(),
    image: z.string().optional(),
  }),
});

const recipes = defineCollection({
  loader: glob({ pattern: ["*.md", "*.mdx"], base: "./src/content/recipes" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.date(),
    ingredients: z.array(
      z.object({ name: z.string(), quantity: z.number(), unit: z.string() })
    ),
    draft: z.boolean().optional(),
    tags: z.array(z.string()).optional(),
    image: z.string().optional(),
  }),
});
const projects = defineCollection({
  loader: glob({ pattern: ["*.md", "*.mdx"], base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.date(),
    technologies: z.array(z.string()),
    draft: z.boolean().optional(),
    tags: z.array(z.string()).optional(),
    image: z.string().optional(),
  }),
});

export const collections = { blog, recipes, projects };
