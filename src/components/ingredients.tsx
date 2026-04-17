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
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-[1fr_auto]">
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
          <p className="text-muted-foreground mt-3 font-mono text-xs">
            Hydration: {hydration}%
          </p>
        )}
      </div>

      <aside className="flex flex-col gap-5 sm:w-40">
        <div>
          <div className="text-muted-foreground mb-2 font-mono text-xs tracking-wider uppercase">
            Scale
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleScaleDown}
              disabled={scale <= 1}
              className="border-border text-muted-foreground hover:border-accent hover:text-accent disabled:hover:border-border disabled:hover:text-muted-foreground flex size-7 items-center justify-center rounded-full border transition-colors disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Decrease scale"
            >
              <Minus size={14} />
            </button>
            <span
              className={`min-w-8 text-center font-mono text-sm ${
                scale > 1 ? "text-accent" : "text-foreground"
              }`}
            >
              {scale}x
            </span>
            <button
              type="button"
              onClick={handleScaleUp}
              className="border-border text-muted-foreground hover:border-accent hover:text-accent flex size-7 items-center justify-center rounded-full border transition-colors"
              aria-label="Increase scale"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        <div>
          <div className="text-muted-foreground mb-2 font-mono text-xs tracking-wider uppercase">
            Units
          </div>
          <div className="flex gap-1.5">
            {unitSystemOptions.map((option) => {
              const active = unitSystem === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setUnitSystem(option.value)}
                  className={`rounded-full border px-3 py-0.5 font-mono text-[11px] transition-colors ${
                    active
                      ? "bg-accent border-accent text-background"
                      : "border-border text-muted-foreground hover:border-accent hover:text-accent"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        {yeastLimitReached && (
          <p className="text-accent font-mono text-xs">
            * No more yeast required after {YEAST_LIMIT}g
          </p>
        )}
      </aside>
    </div>
  );
}
