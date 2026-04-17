import { describe, it, expect } from "vitest";
import { convertIngredient, detectSystem, toGrams } from "./unit-conversion";

describe("detectSystem", () => {
  it("identifies imperial volume units", () => {
    expect(detectSystem("cup")).toBe("imperial");
    expect(detectSystem("cups")).toBe("imperial");
    expect(detectSystem("tbsp")).toBe("imperial");
    expect(detectSystem("tsp")).toBe("imperial");
  });

  it("identifies imperial mass units", () => {
    expect(detectSystem("oz")).toBe("imperial");
    expect(detectSystem("lb")).toBe("imperial");
    expect(detectSystem("lbs")).toBe("imperial");
  });

  it("identifies metric units", () => {
    expect(detectSystem("g")).toBe("metric");
    expect(detectSystem("kg")).toBe("metric");
    expect(detectSystem("ml")).toBe("metric");
    expect(detectSystem("l")).toBe("metric");
    expect(detectSystem("grams")).toBe("metric");
  });

  it("is case insensitive and trims whitespace", () => {
    expect(detectSystem("CUP")).toBe("imperial");
    expect(detectSystem("  Tbsp ")).toBe("imperial");
    expect(detectSystem("KG")).toBe("metric");
  });

  it("returns unknown for unrecognized units", () => {
    expect(detectSystem("pinch")).toBe("unknown");
    expect(detectSystem("clove")).toBe("unknown");
    expect(detectSystem("")).toBe("unknown");
  });
});

describe("toGrams", () => {
  it("passes through grams", () => {
    expect(toGrams("flour", 100, "g")).toBe(100);
  });

  it("converts kg to grams", () => {
    expect(toGrams("water", 1.5, "kg")).toBe(1500);
  });

  it("treats ml as grams (water-equivalent density)", () => {
    expect(toGrams("water", 250, "ml")).toBe(250);
  });

  it("converts l to ml-equivalent grams", () => {
    expect(toGrams("water", 1, "l")).toBe(1000);
  });

  it("converts oz to grams", () => {
    expect(toGrams("butter", 1, "oz")).toBeCloseTo(28.3495, 4);
  });

  it("converts lb to grams", () => {
    expect(toGrams("butter", 1, "lb")).toBeCloseTo(453.592, 3);
  });

  it("converts cups to grams using density lookup", () => {
    expect(toGrams("flour", 1, "cup")).toBe(120);
    expect(toGrams("sugar", 1, "cup")).toBe(200);
    expect(toGrams("butter", 1, "cup")).toBe(227);
  });

  it("converts tbsp to grams using density (flour: 120/16 per tbsp)", () => {
    expect(toGrams("flour", 1, "tbsp")).toBeCloseTo(7.5, 2);
  });

  it("converts tsp to grams using density (flour: 120/48 per tsp)", () => {
    expect(toGrams("flour", 1, "tsp")).toBeCloseTo(2.5, 2);
  });

  it("returns null when cup density is unknown", () => {
    expect(toGrams("unobtanium", 1, "cup")).toBeNull();
  });

  it("returns null for unknown units", () => {
    expect(toGrams("flour", 1, "pinch")).toBeNull();
  });

  it("matches ingredient names via substring", () => {
    expect(toGrams("whole wheat flour", 1, "cup")).toBe(128);
    expect(toGrams("light brown sugar", 1, "cup")).toBe(220);
  });
});

describe("convertIngredient", () => {
  it("returns null for unknown units", () => {
    expect(convertIngredient("flour", 1, "pinch", "metric")).toBeNull();
    expect(convertIngredient("garlic", 3, "clove", "metric")).toBeNull();
  });

  it("returns null when already in target system", () => {
    expect(convertIngredient("flour", 1, "cup", "imperial")).toBeNull();
    expect(convertIngredient("flour", 100, "g", "metric")).toBeNull();
  });

  describe("to metric", () => {
    it("converts cup with density to grams", () => {
      expect(convertIngredient("flour", 2, "cup", "metric")).toEqual({
        quantity: 240,
        unit: "g",
      });
    });

    it("falls back to ml when density unknown", () => {
      const result = convertIngredient("mystery ingredient", 1, "cup", "metric");
      expect(result).toEqual({ quantity: 237, unit: "ml" });
    });

    it("converts tbsp with density to grams", () => {
      // 1 tbsp flour = 120/16 = 7.5g, rounded = 8
      expect(convertIngredient("flour", 1, "tbsp", "metric")).toEqual({
        quantity: 8,
        unit: "g",
      });
    });

    it("converts tsp with density to grams", () => {
      // 3 tsp flour = 3 * 120/48 = 7.5g, rounded = 8
      expect(convertIngredient("flour", 3, "tsp", "metric")).toEqual({
        quantity: 8,
        unit: "g",
      });
    });

    it("converts oz to grams", () => {
      // 4 oz = 4 * 28.3495 = 113.398, rounded = 113
      expect(convertIngredient("butter", 4, "oz", "metric")).toEqual({
        quantity: 113,
        unit: "g",
      });
    });

    it("converts lb to grams", () => {
      // 1 lb = 454 (rounded)
      expect(convertIngredient("butter", 1, "lb", "metric")).toEqual({
        quantity: 454,
        unit: "g",
      });
    });
  });

  describe("to imperial", () => {
    it("converts grams with density to cups", () => {
      // 240g flour / 120 = 2 cups
      expect(convertIngredient("flour", 240, "g", "imperial")).toEqual({
        quantity: 2,
        unit: "cup",
      });
    });

    it("converts small gram amounts with density to tbsp", () => {
      // 15g flour / 120 = 0.125 cups; cups < 0.25 → tbsp branch
      // 0.125 cup * 16 = 2 tbsp
      const result = convertIngredient("flour", 15, "g", "imperial");
      expect(result?.unit).toBe("tbsp");
      expect(result?.quantity).toBeCloseTo(2, 1);
    });

    it("converts very small gram amounts with density to tsp", () => {
      // 2g flour is tiny; goes through cups→tbsp→tsp cascade
      const result = convertIngredient("flour", 2, "g", "imperial");
      expect(result?.unit).toBe("tsp");
    });

    it("converts grams with no density via mass cascade", () => {
      // 500g mystery → should land in oz or lb
      const result = convertIngredient("mystery", 500, "g", "imperial");
      expect(["oz", "lb"]).toContain(result?.unit);
    });

    it("converts kg with density to cups", () => {
      // 0.24 kg flour = 240g / 120 = 2 cups
      expect(convertIngredient("flour", 0.24, "kg", "imperial")).toEqual({
        quantity: 2,
        unit: "cup",
      });
    });

    it("converts ml to cups when large enough", () => {
      // 500ml / 236.588 = 2.113 cups → rounded to 1/8 = 2.125
      const result = convertIngredient("water", 500, "ml", "imperial");
      expect(result?.unit).toBe("cup");
      expect(result?.quantity).toBeCloseTo(2.125, 3);
    });

    it("converts small ml amounts to tbsp", () => {
      // 30ml / 236.588 = 0.127 cups; < 0.25, falls to tbsp
      // 30 / 14.787 ≈ 2.028 tbsp
      const result = convertIngredient("water", 30, "ml", "imperial");
      expect(result?.unit).toBe("tbsp");
    });

    it("converts very small ml amounts to tsp", () => {
      // 3ml: cups tiny, tbsp < 1, falls to tsp
      const result = convertIngredient("water", 3, "ml", "imperial");
      expect(result?.unit).toBe("tsp");
    });

    it("converts l to cups", () => {
      // 1l = 1000ml / 236.588 = 4.227 cups
      const result = convertIngredient("water", 1, "l", "imperial");
      expect(result?.unit).toBe("cup");
      expect(result?.quantity).toBeGreaterThan(4);
    });

    it("prefers imperial mass for listed ingredients", () => {
      // dried spaghetti is in PREFER_IMPERIAL_MASS — should skip cup conversion
      const result = convertIngredient("dried spaghetti", 454, "g", "imperial");
      expect(["oz", "lb"]).toContain(result?.unit);
    });
  });
});
