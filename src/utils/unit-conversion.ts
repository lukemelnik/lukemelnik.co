import { INGREDIENT_DENSITIES, VOLUME_RATIOS } from "../data/ingredient-densities";

type UnitSystem = "metric" | "imperial" | "unknown";

const IMPERIAL_UNITS = ["cup", "cups", "tbsp", "tsp", "oz", "lb", "lbs", "pint", "quart", "gallon"];
const METRIC_UNITS = ["g", "kg", "ml", "l", "gram", "grams", "kilogram", "kilograms", "milliliter", "milliliters", "liter", "liters"];
const UNCONVERTIBLE_UNITS = ["whole", "can", "cans", "clove", "cloves", "pinch", "dash", "slice", "slices", "piece", "pieces", "bunch", "head", "sprig", "sprigs", "leaf", "leaves", "stalk", "stalks", "ear", "ears"];

export function detectSystem(unit: string): UnitSystem {
  const lower = unit.toLowerCase().trim();
  if (IMPERIAL_UNITS.includes(lower)) return "imperial";
  if (METRIC_UNITS.includes(lower)) return "metric";
  return "unknown";
}

function lookupDensity(name: string): number | null {
  const lower = name.toLowerCase().trim();
  // Exact match
  if (INGREDIENT_DENSITIES[lower]) return INGREDIENT_DENSITIES[lower].gramsPerCup;
  // Substring match: check if any key is contained in the name or vice versa
  for (const [key, value] of Object.entries(INGREDIENT_DENSITIES)) {
    if (lower.includes(key) || key.includes(lower)) return value.gramsPerCup;
  }
  return null;
}

function normalizeUnit(unit: string): string {
  const lower = unit.toLowerCase().trim();
  if (lower === "cups" || lower === "cup") return "cup";
  if (lower === "tbsp") return "tbsp";
  if (lower === "tsp") return "tsp";
  if (lower === "oz") return "oz";
  if (lower === "lb" || lower === "lbs") return "lb";
  if (lower === "g" || lower === "gram" || lower === "grams") return "g";
  if (lower === "kg" || lower === "kilogram" || lower === "kilograms") return "kg";
  if (lower === "ml" || lower === "milliliter" || lower === "milliliters") return "ml";
  if (lower === "l" || lower === "liter" || lower === "liters") return "l";
  return lower;
}

export function convertIngredient(
  name: string,
  quantity: number,
  unit: string,
  targetSystem: "metric" | "imperial",
): { quantity: number; unit: string } | null {
  const normalized = normalizeUnit(unit);
  const currentSystem = detectSystem(unit);

  // Can't convert unknown or unconvertible units
  if (currentSystem === "unknown" || UNCONVERTIBLE_UNITS.includes(normalized)) return null;
  // Already in the target system
  if (currentSystem === targetSystem) return null;

  if (targetSystem === "metric") {
    return convertToMetric(name, quantity, normalized);
  } else {
    return convertToImperial(name, quantity, normalized);
  }
}

function convertToMetric(
  name: string,
  quantity: number,
  unit: string,
): { quantity: number; unit: string } | null {
  const density = lookupDensity(name);

  switch (unit) {
    case "cup": {
      if (density) {
        return { quantity: Math.round(quantity * density), unit: "g" };
      }
      // Fallback to ml
      return { quantity: Math.round(quantity * VOLUME_RATIOS.mlPerCup), unit: "ml" };
    }
    case "tbsp": {
      if (density) {
        const cups = quantity / VOLUME_RATIOS.tbspPerCup;
        return { quantity: Math.round(cups * density), unit: "g" };
      }
      return { quantity: Math.round(quantity * VOLUME_RATIOS.mlPerTbsp), unit: "ml" };
    }
    case "tsp": {
      if (density) {
        const cups = quantity / (VOLUME_RATIOS.tbspPerCup * VOLUME_RATIOS.tspPerTbsp);
        return { quantity: Math.round(cups * density), unit: "g" };
      }
      return { quantity: Math.round(quantity * VOLUME_RATIOS.mlPerTsp), unit: "ml" };
    }
    case "oz":
      return { quantity: Math.round(quantity * VOLUME_RATIOS.gramsPerOz), unit: "g" };
    case "lb":
      return { quantity: Math.round(quantity * VOLUME_RATIOS.gramsPerLb), unit: "g" };
    default:
      return null;
  }
}

function convertToImperial(
  name: string,
  quantity: number,
  unit: string,
): { quantity: number; unit: string } | null {
  const density = lookupDensity(name);

  switch (unit) {
    case "g": {
      if (density) {
        const cups = quantity / density;
        if (cups >= 0.25) {
          return { quantity: cups, unit: "cup" };
        }
        // Step down to tbsp
        const tbsp = cups * VOLUME_RATIOS.tbspPerCup;
        if (tbsp >= 1) {
          return { quantity: tbsp, unit: "tbsp" };
        }
        // Step down to tsp
        return { quantity: tbsp * VOLUME_RATIOS.tspPerTbsp, unit: "tsp" };
      }
      // Fallback: grams to oz
      return { quantity: quantity / VOLUME_RATIOS.gramsPerOz, unit: "oz" };
    }
    case "kg": {
      const grams = quantity * 1000;
      if (density) {
        const cups = grams / density;
        return { quantity: cups, unit: "cup" };
      }
      return { quantity: grams / VOLUME_RATIOS.gramsPerLb, unit: "lb" };
    }
    case "ml": {
      const cups = quantity / VOLUME_RATIOS.mlPerCup;
      if (cups >= 0.25) {
        return { quantity: cups, unit: "cup" };
      }
      const tbsp = quantity / VOLUME_RATIOS.mlPerTbsp;
      if (tbsp >= 1) {
        return { quantity: tbsp, unit: "tbsp" };
      }
      return { quantity: quantity / VOLUME_RATIOS.mlPerTsp, unit: "tsp" };
    }
    case "l": {
      const ml = quantity * 1000;
      const cups = ml / VOLUME_RATIOS.mlPerCup;
      return { quantity: cups, unit: "cup" };
    }
    default:
      return null;
  }
}
