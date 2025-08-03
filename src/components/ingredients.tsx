import { Minus, Plus } from "lucide-react";
import { useState, useEffect } from "react";

type Ingredient = {
  name: string;
  quantity?: number;
  unit?: string;
  note?: string;
};

type IngredientSection = {
  section: string;
  items: Ingredient[];
};

type IngredientsProps = {
  ingredients: (Ingredient | IngredientSection)[];
};

export default function Ingredients({ ingredients }: IngredientsProps) {
  const [scale, setScale] = useState(1);
  const [yeastLimitReached, setYeastLimitReached] = useState(false);
  const yeastLimit = 10;

  function handleScaleUp() {
    setScale(scale + 1);
  }

  function handleScaleDown() {
    if (scale > 1) {
      setScale(scale - 1);
    }
  }

  // Convert decimal to fraction
  function decimalToFraction(decimal: number): string {
    // Handle whole numbers
    if (Number.isInteger(decimal)) {
      return decimal.toString();
    }

    // Handle common fractions
    const tolerance = 0.01;
    const commonFractions: [number, string][] = [
      [0.25, "¼"],
      [0.33, "⅓"],
      [0.5, "½"],
      [0.67, "⅔"],
      [0.75, "¾"],
      [0.125, "⅛"],
      [0.375, "⅜"],
      [0.625, "⅝"],
      [0.875, "⅞"],
    ];

    // Get whole number part
    const wholePart = Math.floor(decimal);
    const decimalPart = decimal - wholePart;

    // Check if close to common fraction
    for (const [value, fraction] of commonFractions) {
      if (Math.abs(decimalPart - value) < tolerance) {
        return wholePart > 0 ? `${wholePart} ${fraction}` : fraction;
      }
    }

    // If no common fraction matches, round to 1 decimal place
    return Number.isInteger(decimal)
      ? decimal.toString()
      : decimal.toFixed(1).replace(/\.0$/, "");
    return decimal.toFixed(1);
  }

  function scaleQuantity(ingredient: Ingredient) {
    if (ingredient.quantity === undefined) return undefined;

    const scaled = ingredient.quantity * scale;
    if (ingredient.name.toLowerCase() === "yeast" && scaled > yeastLimit) {
      return yeastLimit;
    }
    return scaled;
  }

  // Helper to check if an item is a section
  function isSection(
    item: Ingredient | IngredientSection,
  ): item is IngredientSection {
    return "section" in item && "items" in item;
  }

  // Get all ingredients from all sections for yeast limit check
  const allIngredients = ingredients.flatMap((item) =>
    isSection(item) ? item.items : [item],
  );

  useEffect(() => {
    const hasYeastOverLimit = allIngredients.some(
      (ingredient) =>
        ingredient.name.toLowerCase() === "yeast" &&
        ingredient.quantity !== undefined &&
        ingredient.quantity * scale > yeastLimit,
    );
    setYeastLimitReached(hasYeastOverLimit);
  }, [allIngredients, scale, yeastLimit]);

  function fixIngredientPlural(
    unit: string | undefined,
    quantity: number | undefined,
  ) {
    if (unit === undefined) return "";
    const unitInfo = [
      { match: /cup/i, singular: "cup", plural: "cups" },
      { match: /clove/i, singular: "clove", plural: "cloves" },
      { match: /lb/i, singular: "lb", plural: "lbs" },
    ];
    for (const { match, singular, plural } of unitInfo) {
      if (match.test(unit) && quantity) {
        return quantity <= 1 ? singular : plural;
      }
    }
    return unit;
  }

  // Render a single ingredient
  const renderIngredient = (ingredient: Ingredient, index: number) => {
    const scaledQuantity = scaleQuantity(ingredient);
    const unit = fixIngredientPlural(ingredient?.unit, scaledQuantity);
    return (
      <li key={index}>
        {scaledQuantity !== undefined
          ? `${decimalToFraction(scaledQuantity)} ${unit ?? ""} ${ingredient.name}`
          : ingredient.name}{" "}
        {ingredient.note}
      </li>
    );
  };

  return (
    <div>
      {ingredients.map((item, idx) => {
        if (isSection(item)) {
          // Render a section with its own heading and ingredients
          return (
            <div key={idx} className="mb-6">
              <h3 className="mb-2 text-lg font-medium">{item.section}</h3>
              <ul className="mb-4 list-disc pl-5">
                {item.items.map((ingredient, index) =>
                  renderIngredient(ingredient, index),
                )}
              </ul>
            </div>
          );
        } else {
          // If there are no sections, just render the ingredients directly
          if (idx === 0) {
            // Only create the ul wrapper for the first non-section item
            return (
              <ul key={idx} className="mb-4 list-disc pl-5">
                {ingredients
                  .filter((i) => !isSection(i))
                  .map((ingredient, index) =>
                    renderIngredient(ingredient as Ingredient, index),
                  )}
              </ul>
            );
          }
          // Skip other non-section items as they're handled in the first one
          return null;
        }
      })}

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <p>Recipe scale: </p>
          <p className={`min-w-8 ${scale > 1 && "text-amber-600"}`}>{scale}x</p>
          <div>
            <div className="flex items-center gap-1">
              <button
                className="bg-foreground text-background flex size-8 items-center justify-center rounded-lg text-center"
                onClick={handleScaleUp}
              >
                <Plus size={16} className="text-background" />
              </button>
              <button
                className="bg-foreground text-background flex size-8 items-center justify-center rounded-lg"
                onClick={handleScaleDown}
                disabled={scale <= 1}
              >
                <Minus size={16} />
              </button>
            </div>
          </div>
        </div>
        {yeastLimitReached && (
          <p className="text-amber-600">
            * No more yeast required after {yeastLimit}g
          </p>
        )}
      </div>
    </div>
  );
}
