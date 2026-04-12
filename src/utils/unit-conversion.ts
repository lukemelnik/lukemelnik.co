import { INGREDIENT_DENSITIES, VOLUME_RATIOS } from "../data/ingredient-densities";

type UnitSystem = "metric" | "imperial" | "unknown";

const IMPERIAL_UNITS = ["cup", "cups", "tbsp", "tsp", "oz", "lb", "lbs", "pint", "quart", "gallon"];
const METRIC_UNITS = ["g", "kg", "ml", "l", "gram", "grams", "kilogram", "kilograms", "milliliter", "milliliters", "liter", "liters"];
const UNCONVERTIBLE_UNITS = ["whole", "can", "cans", "clove", "cloves", "pinch", "dash", "slice", "slices", "piece", "pieces", "bunch", "head", "sprig", "sprigs", "leaf", "leaves", "stalk", "stalks", "ear", "ears"];
const PREFER_IMPERIAL_MASS = ["dried spaghetti", "crushed tomatoes"];

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

function shouldPreferImperialMass(name: string): boolean {
  const lower = name.toLowerCase().trim();
  return PREFER_IMPERIAL_MASS.some(
    (ingredient) => lower.includes(ingredient) || ingredient.includes(lower),
  );
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

export function toGrams(name: string, quantity: number, unit: string): number | null {
  const normalized = normalizeUnit(unit);
  switch (normalized) {
    case "g":
      return quantity;
    case "kg":
      return quantity * 1000;
    case "ml":
      return quantity;
    case "l":
      return quantity * 1000;
    case "cup": {
      const density = lookupDensity(name);
      return density ? quantity * density : null;
    }
    case "tbsp": {
      const density = lookupDensity(name);
      if (!density) return null;
      return (quantity / VOLUME_RATIOS.tbspPerCup) * density;
    }
    case "tsp": {
      const density = lookupDensity(name);
      if (!density) return null;
      return (quantity / (VOLUME_RATIOS.tbspPerCup * VOLUME_RATIOS.tspPerTbsp)) * density;
    }
    case "oz":
      return quantity * VOLUME_RATIOS.gramsPerOz;
    case "lb":
      return quantity * VOLUME_RATIOS.gramsPerLb;
    default:
      return null;
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

// Round to nearest practical measuring increment
function roundCups(n: number): number { return Math.round(n * 8) / 8; }    // nearest 1/8 cup
function roundSpoons(n: number): number { return Math.round(n * 4) / 4; }  // nearest 1/4 tsp/tbsp
function roundOz(n: number): number { return Math.round(n * 2) / 2; }      // nearest 1/2 oz
function roundLb(n: number): number { return Math.round(n * 4) / 4; }      // nearest 1/4 lb

function convertGramsToImperialMass(quantity: number): { quantity: number; unit: string } {
  const teaspoons = quantity / VOLUME_RATIOS.mlPerTsp;
  if (teaspoons < 3) {
    return { quantity: roundSpoons(teaspoons), unit: "tsp" };
  }

  const tablespoons = teaspoons / VOLUME_RATIOS.tspPerTbsp;
  if (tablespoons < 4) {
    return { quantity: roundSpoons(tablespoons), unit: "tbsp" };
  }

  const ounces = quantity / VOLUME_RATIOS.gramsPerOz;
  if (ounces < 16) {
    return { quantity: roundOz(ounces), unit: "oz" };
  }

  return { quantity: roundLb(quantity / VOLUME_RATIOS.gramsPerLb), unit: "lb" };
}

function convertToImperial(
  name: string,
  quantity: number,
  unit: string,
): { quantity: number; unit: string } | null {
  const density = lookupDensity(name);

  switch (unit) {
    case "g": {
      if (density && !shouldPreferImperialMass(name)) {
        const cups = quantity / density;
        if (cups >= 0.25) {
          return { quantity: roundCups(cups), unit: "cup" };
        }
        const tbsp = cups * VOLUME_RATIOS.tbspPerCup;
        if (tbsp >= 1) {
          return { quantity: roundSpoons(tbsp), unit: "tbsp" };
        }
        return { quantity: roundSpoons(tbsp * VOLUME_RATIOS.tspPerTbsp), unit: "tsp" };
      }
      return convertGramsToImperialMass(quantity);
    }
    case "kg": {
      const grams = quantity * 1000;
      if (density && !shouldPreferImperialMass(name)) {
        return { quantity: roundCups(grams / density), unit: "cup" };
      }
      return convertGramsToImperialMass(grams);
    }
    case "ml": {
      const cups = quantity / VOLUME_RATIOS.mlPerCup;
      if (cups >= 0.25) {
        return { quantity: roundCups(cups), unit: "cup" };
      }
      const tbsp = quantity / VOLUME_RATIOS.mlPerTbsp;
      if (tbsp >= 1) {
        return { quantity: roundSpoons(tbsp), unit: "tbsp" };
      }
      return { quantity: roundSpoons(quantity / VOLUME_RATIOS.mlPerTsp), unit: "tsp" };
    }
    case "l": {
      const ml = quantity * 1000;
      return { quantity: roundCups(ml / VOLUME_RATIOS.mlPerCup), unit: "cup" };
    }
    default:
      return null;
  }
}
