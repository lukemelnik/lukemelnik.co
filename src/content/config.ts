import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  loader: glob({ pattern: ["*.md", "*.mdx"], base: "./src/content/blog" }),
  schema: ({ image }) =>
    z.object({
      cover: z.string().optional(),
      alt: z.string().optional(),
      title: z.string(),
      description: z.string(),
      publishDate: z.date(),
      draft: z.boolean().optional(),
      tags: z.array(z.string()).optional(),
    }),
});

// Define the ingredient schema to be reused
const validUnits = z.enum([
  // Imperial volume
  "cup", "tbsp", "tsp",
  // Imperial weight
  "oz", "lb",
  // Metric
  "g", "kg", "ml", "l",
  // Count/descriptive
  "whole", "can", "clove", "cloves", "full", "small", "large bowl",
]);

const ingredientSchema = z.object({
  name: z.string(),
  quantity: z.number().optional(),
  unit: validUnits.optional(),
  note: z.string().optional(),
});

// Define a section schema for grouped ingredients
const sectionSchema = z.object({
  section: z.string(),
  items: z.array(ingredientSchema),
});

const recipes = defineCollection({
  loader: glob({ pattern: ["*.md", "*.mdx"], base: "./src/content/recipes" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.date(),
    familyRecipe: z.boolean().optional(),
    ingredients: z.union([
      // Support both flat arrays of ingredients and sectioned ingredients
      z.array(ingredientSchema),
      z.array(sectionSchema),
    ]),
    bread: z.boolean().optional(),
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
    url: z.string().optional(),
    github: z.string().optional(),
    draft: z.boolean().optional(),
    tags: z.array(z.string()).optional(),
    image: z.string().optional(),
    role: z.enum(["solo", "lead", "contributor"]).optional(),
    status: z.enum(["shipped", "wip", "archived"]).optional(),
  }),
});

export const collections = { blog, recipes, projects };
