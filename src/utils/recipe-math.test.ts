import { describe, it, expect } from "vitest";
import {
  calculateHydration,
  decimalToFraction,
  detectNativeSystem,
  fixUnitPlural,
  flattenIngredients,
  formatQuantity,
  hasYeastOverLimit,
  isSection,
  scaleIngredientQuantity,
} from "./recipe-math";

describe("isSection", () => {
  it("identifies sectioned ingredients", () => {
    expect(isSection({ section: "Dough", items: [] })).toBe(true);
  });

  it("identifies flat ingredients", () => {
    expect(isSection({ name: "flour", quantity: 1, unit: "cup" })).toBe(false);
  });
});

describe("flattenIngredients", () => {
  it("returns flat list as-is", () => {
    const items = [
      { name: "flour", quantity: 1, unit: "cup" },
      { name: "water", quantity: 200, unit: "ml" },
    ];
    expect(flattenIngredients(items)).toEqual(items);
  });

  it("flattens sectioned ingredients", () => {
    const result = flattenIngredients([
      {
        section: "Dough",
        items: [
          { name: "flour", quantity: 500, unit: "g" },
          { name: "water", quantity: 350, unit: "g" },
        ],
      },
      {
        section: "Filling",
        items: [{ name: "sugar", quantity: 100, unit: "g" }],
      },
    ]);
    expect(result).toHaveLength(3);
    expect(result.map((i) => i.name)).toEqual(["flour", "water", "sugar"]);
  });

  it("mixes sectioned and flat", () => {
    const result = flattenIngredients([
      { name: "salt", quantity: 1, unit: "tsp" },
      {
        section: "Dough",
        items: [{ name: "flour", quantity: 500, unit: "g" }],
      },
    ]);
    expect(result).toHaveLength(2);
  });
});

describe("detectNativeSystem", () => {
  it("detects metric when metric units dominate", () => {
    expect(
      detectNativeSystem([
        { name: "flour", quantity: 500, unit: "g" },
        { name: "water", quantity: 350, unit: "ml" },
        { name: "salt", quantity: 1, unit: "tsp" },
      ]),
    ).toBe("metric");
  });

  it("defaults to imperial on tie", () => {
    expect(
      detectNativeSystem([
        { name: "flour", quantity: 1, unit: "cup" },
        { name: "water", quantity: 200, unit: "ml" },
      ]),
    ).toBe("imperial");
  });

  it("defaults to imperial when all units are unknown", () => {
    expect(
      detectNativeSystem([{ name: "egg", quantity: 1, unit: "whole" }]),
    ).toBe("imperial");
  });

  it("handles sections", () => {
    expect(
      detectNativeSystem([
        {
          section: "Dough",
          items: [
            { name: "flour", quantity: 500, unit: "g" },
            { name: "water", quantity: 350, unit: "g" },
          ],
        },
      ]),
    ).toBe("metric");
  });
});

describe("scaleIngredientQuantity", () => {
  it("multiplies quantity by scale", () => {
    expect(
      scaleIngredientQuantity(
        { name: "flour", quantity: 100, unit: "g" },
        2,
        10,
      ),
    ).toBe(200);
  });

  it("returns undefined when quantity is missing", () => {
    expect(
      scaleIngredientQuantity({ name: "salt", unit: "pinch" }, 3, 10),
    ).toBeUndefined();
  });

  it("caps yeast at the yeast limit", () => {
    expect(
      scaleIngredientQuantity({ name: "yeast", quantity: 5, unit: "g" }, 3, 10),
    ).toBe(10);
  });

  it("does not cap yeast below the limit", () => {
    expect(
      scaleIngredientQuantity({ name: "yeast", quantity: 3, unit: "g" }, 2, 10),
    ).toBe(6);
  });

  it("cap is case-insensitive on name", () => {
    expect(
      scaleIngredientQuantity({ name: "Yeast", quantity: 5, unit: "g" }, 5, 10),
    ).toBe(10);
  });
});

describe("hasYeastOverLimit", () => {
  it("returns true when yeast scaled exceeds limit", () => {
    expect(
      hasYeastOverLimit(
        [{ name: "yeast", quantity: 5, unit: "g" }],
        3,
        10,
      ),
    ).toBe(true);
  });

  it("returns false when yeast scaled stays under limit", () => {
    expect(
      hasYeastOverLimit(
        [{ name: "yeast", quantity: 3, unit: "g" }],
        2,
        10,
      ),
    ).toBe(false);
  });

  it("returns false when no yeast present", () => {
    expect(
      hasYeastOverLimit([{ name: "flour", quantity: 500, unit: "g" }], 10, 10),
    ).toBe(false);
  });
});

describe("calculateHydration", () => {
  it("returns flour-to-water ratio as percent", () => {
    // 350g water / 500g flour = 70%
    expect(
      calculateHydration([
        { name: "bread flour", quantity: 500, unit: "g" },
        { name: "water", quantity: 350, unit: "g" },
      ]),
    ).toBe(70);
  });

  it("returns null when no flour is present", () => {
    expect(
      calculateHydration([{ name: "water", quantity: 300, unit: "ml" }]),
    ).toBeNull();
  });

  it("sums multiple flours and waters", () => {
    // 400g bread flour + 100g whole wheat flour = 500g flour
    // 200g water + 150g water = 350g water → 70%
    expect(
      calculateHydration([
        { name: "bread flour", quantity: 400, unit: "g" },
        { name: "whole wheat flour", quantity: 100, unit: "g" },
        { name: "water", quantity: 200, unit: "g" },
        { name: "water", quantity: 150, unit: "g" },
      ]),
    ).toBe(70);
  });

  it("converts cups to grams for hydration math", () => {
    // 1 cup flour = 120g, 1 cup water = 236.588g → 197%
    const result = calculateHydration([
      { name: "flour", quantity: 1, unit: "cup" },
      { name: "water", quantity: 1, unit: "cup" },
    ]);
    expect(result).toBeGreaterThan(190);
    expect(result).toBeLessThan(200);
  });

  it("ignores ingredients with no quantity or unit", () => {
    expect(
      calculateHydration([
        { name: "bread flour", quantity: 500, unit: "g" },
        { name: "water", quantity: 350, unit: "g" },
        { name: "salt" },
      ]),
    ).toBe(70);
  });
});

describe("decimalToFraction", () => {
  it("returns integers as-is", () => {
    expect(decimalToFraction(3)).toBe("3");
    expect(decimalToFraction(0)).toBe("0");
  });

  it("maps common fractions to unicode", () => {
    expect(decimalToFraction(0.25)).toBe("¼");
    expect(decimalToFraction(0.5)).toBe("½");
    expect(decimalToFraction(0.75)).toBe("¾");
    expect(decimalToFraction(0.125)).toBe("⅛");
    expect(decimalToFraction(0.33)).toBe("⅓");
    expect(decimalToFraction(0.67)).toBe("⅔");
  });

  it("combines whole number with fraction", () => {
    expect(decimalToFraction(1.5)).toBe("1 ½");
    expect(decimalToFraction(2.25)).toBe("2 ¼");
  });

  it("falls back to decimal for non-common values", () => {
    expect(decimalToFraction(0.4)).toBe("0.4");
  });

  it("handles tolerance near common fractions", () => {
    // 0.51 is within tolerance of 0.5
    expect(decimalToFraction(0.505)).toBe("½");
  });
});

describe("fixUnitPlural", () => {
  it("returns empty string for undefined unit", () => {
    expect(fixUnitPlural(undefined, 1)).toBe("");
  });

  it("uses singular for quantity <= 1", () => {
    expect(fixUnitPlural("cup", 1)).toBe("cup");
    expect(fixUnitPlural("cloves", 1)).toBe("clove");
    expect(fixUnitPlural("lbs", 1)).toBe("lb");
  });

  it("uses plural for quantity > 1", () => {
    expect(fixUnitPlural("cup", 2)).toBe("cups");
    expect(fixUnitPlural("clove", 3)).toBe("cloves");
    expect(fixUnitPlural("lb", 5)).toBe("lbs");
  });

  it("passes through unknown units unchanged", () => {
    expect(fixUnitPlural("tbsp", 2)).toBe("tbsp");
    expect(fixUnitPlural("g", 500)).toBe("g");
  });

  it("returns unit unchanged when quantity is undefined or 0", () => {
    expect(fixUnitPlural("cup", undefined)).toBe("cup");
    expect(fixUnitPlural("cup", 0)).toBe("cup");
  });
});

describe("formatQuantity", () => {
  it("rounds grams to integers", () => {
    expect(formatQuantity(123.7, "g")).toBe("124");
  });

  it("rounds ml to integers", () => {
    expect(formatQuantity(250.4, "ml")).toBe("250");
  });

  it("uses fractions for non-weight units", () => {
    expect(formatQuantity(0.5, "cup")).toBe("½");
    expect(formatQuantity(1.25, "cup")).toBe("1 ¼");
  });

  it("handles integer non-weight quantities", () => {
    expect(formatQuantity(2, "tbsp")).toBe("2");
  });
});
