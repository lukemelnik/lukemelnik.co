import { Minus, Plus } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { convertIngredient } from "../utils/unit-conversion";
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
  type Ingredient,
  type IngredientSection,
  type UnitSystem,
} from "../utils/recipe-math";

const YEAST_LIMIT = 10;

type IngredientsProps = {
  ingredients: (Ingredient | IngredientSection)[];
  bread?: boolean;
};

export default function Ingredients({ ingredients, bread }: IngredientsProps) {
  const [scale, setScale] = useState(1);
  const [yeastLimitReached, setYeastLimitReached] = useState(false);

  const nativeSystem = useMemo<UnitSystem>(
    () => detectNativeSystem(ingredients),
    [ingredients],
  );

  const [unitSystem, setUnitSystem] = useState<UnitSystem>(nativeSystem);

  const allIngredients = useMemo(
    () => flattenIngredients(ingredients),
    [ingredients],
  );

  const hydration = useMemo(
    () => (bread ? calculateHydration(allIngredients) : null),
    [bread, allIngredients],
  );

  useEffect(() => {
    setYeastLimitReached(
      hasYeastOverLimit(allIngredients, scale, YEAST_LIMIT),
    );
  }, [allIngredients, scale]);

  function handleScaleUp() {
    setScale(scale + 1);
  }

  function handleScaleDown() {
    if (scale > 1) setScale(scale - 1);
  }

  const renderIngredient = (ingredient: Ingredient, index: number) => {
    const scaledQuantity = scaleIngredientQuantity(
      ingredient,
      scale,
      YEAST_LIMIT,
    );

    if (scaledQuantity !== undefined && ingredient.unit) {
      const converted = convertIngredient(
        ingredient.name,
        scaledQuantity,
        ingredient.unit,
        unitSystem,
      );
      if (converted) {
        const displayUnit = fixUnitPlural(converted.unit, converted.quantity);
        return (
          <li key={index}>
            {formatQuantity(converted.quantity, converted.unit)} {displayUnit}{" "}
            {ingredient.name} {ingredient.note}
          </li>
        );
      }
    }

    const unit = fixUnitPlural(ingredient?.unit, scaledQuantity);
    return (
      <li key={index}>
        {scaledQuantity !== undefined
          ? `${decimalToFraction(scaledQuantity)} ${unit ?? ""} ${ingredient.name}`
          : ingredient.name}{" "}
        {ingredient.note}
      </li>
    );
  };

  const unitSystemOptions: { value: UnitSystem; label: string }[] = [
    { value: "metric", label: "Metric" },
    { value: "imperial", label: "Imperial" },
  ];

  return (
    <div>
      {ingredients.map((item, idx) => {
        if (isSection(item)) {
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
          if (idx === 0) {
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
          return null;
        }
      })}

      {hydration !== null && (
        <p className="mb-4 text-sm">Hydration: {hydration}%</p>
      )}

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <p>Recipe scale: </p>
          <p className={`min-w-8 ${scale > 1 && "text-accent"}`}>{scale}x</p>
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

        <div className="flex items-center gap-3">
          <p>Units: </p>
          <div className="flex gap-1">
            {unitSystemOptions.map((option) => (
              <button
                key={option.value}
                className={`rounded-lg px-3 py-1 text-sm transition-colors ${
                  unitSystem === option.value
                    ? "bg-foreground text-background"
                    : "bg-muted text-foreground hover:bg-muted-foreground/30"
                }`}
                onClick={() => setUnitSystem(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {yeastLimitReached && (
          <p className="text-accent">
            * No more yeast required after {YEAST_LIMIT}g
          </p>
        )}
      </div>
    </div>
  );
}
