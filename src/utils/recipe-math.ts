import { toGrams } from "./unit-conversion";

export type UnitSystem = "metric" | "imperial";

export type Ingredient = {
  name: string;
  quantity?: number;
  unit?: string;
  note?: string;
};

export type IngredientSection = {
  section: string;
  items: Ingredient[];
};

export function isSection(
  item: Ingredient | IngredientSection,
): item is IngredientSection {
  return "section" in item && "items" in item;
}

export function flattenIngredients(
  items: (Ingredient | IngredientSection)[],
): Ingredient[] {
  return items.flatMap((item) => (isSection(item) ? item.items : [item]));
}

export function detectNativeSystem(
  items: (Ingredient | IngredientSection)[],
): UnitSystem {
  let imperial = 0;
  let metric = 0;
  const imperialUnits = new Set([
    "cup", "cups", "tbsp", "tsp", "oz", "lb", "lbs",
  ]);
  const metricUnits = new Set([
    "g", "kg", "ml", "l", "gram", "grams",
  ]);
  for (const item of flattenIngredients(items)) {
    if (!item.unit) continue;
    const u = item.unit.toLowerCase().trim();
    if (imperialUnits.has(u)) imperial++;
    else if (metricUnits.has(u)) metric++;
  }
  return metric > imperial ? "metric" : "imperial";
}

export function scaleIngredientQuantity(
  ingredient: Ingredient,
  scale: number,
  yeastLimit: number,
): number | undefined {
  if (ingredient.quantity === undefined) return undefined;
  const scaled = ingredient.quantity * scale;
  if (ingredient.name.toLowerCase() === "yeast" && scaled > yeastLimit) {
    return yeastLimit;
  }
  return scaled;
}

export function hasYeastOverLimit(
  ingredients: Ingredient[],
  scale: number,
  yeastLimit: number,
): boolean {
  return ingredients.some(
    (ingredient) =>
      ingredient.name.toLowerCase() === "yeast" &&
      ingredient.quantity !== undefined &&
      ingredient.quantity * scale > yeastLimit,
  );
}

export function calculateHydration(ingredients: Ingredient[]): number | null {
  const flourPattern = /\bflour\b/i;
  const waterPattern = /\bwater\b/i;
  let totalFlour = 0;
  let totalWater = 0;
  for (const item of ingredients) {
    if (!item.quantity || !item.unit) continue;
    if (flourPattern.test(item.name)) {
      const grams = toGrams(item.name, item.quantity, item.unit);
      if (grams) totalFlour += grams;
    }
    if (waterPattern.test(item.name)) {
      const grams = toGrams(item.name, item.quantity, item.unit);
      if (grams) totalWater += grams;
    }
  }
  if (totalFlour === 0) return null;
  return Math.round((totalWater / totalFlour) * 100);
}

export function decimalToFraction(decimal: number): string {
  if (Number.isInteger(decimal)) return decimal.toString();

  const tolerance = 0.01;
  const commonFractions: [number, string][] = [
    [0.125, "⅛"],
    [0.25, "¼"],
    [0.33, "⅓"],
    [0.375, "⅜"],
    [0.5, "½"],
    [0.625, "⅝"],
    [0.67, "⅔"],
    [0.75, "¾"],
    [0.875, "⅞"],
  ];

  const wholePart = Math.floor(decimal);
  const decimalPart = decimal - wholePart;

  for (const [value, fraction] of commonFractions) {
    if (Math.abs(decimalPart - value) < tolerance) {
      return wholePart > 0 ? `${wholePart} ${fraction}` : fraction;
    }
  }

  return decimal.toFixed(1).replace(/\.0$/, "");
}

export function fixUnitPlural(
  unit: string | undefined,
  quantity: number | undefined,
): string {
  if (unit === undefined) return "";
  const rules: { match: RegExp; singular: string; plural: string }[] = [
    { match: /cup/i, singular: "cup", plural: "cups" },
    { match: /clove/i, singular: "clove", plural: "cloves" },
    { match: /lb/i, singular: "lb", plural: "lbs" },
  ];
  for (const { match, singular, plural } of rules) {
    if (match.test(unit) && quantity) {
      return quantity <= 1 ? singular : plural;
    }
  }
  return unit;
}

export function formatQuantity(quantity: number, unit: string): string {
  if (unit === "g" || unit === "ml") {
    return Math.round(quantity).toString();
  }
  return decimalToFraction(quantity);
}
