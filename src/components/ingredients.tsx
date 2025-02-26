import { Minus, Plus } from "lucide-react";
import { useState, useEffect } from "react";

type Ingredient = {
  name: string;
  quantity?: number;
  unit?: string;
  note?: string;
};

type IngredientsProps = {
  ingredients: Ingredient[];
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

  function scaleQuantity(ingredient: Ingredient) {
    if (ingredient.quantity === undefined) return undefined;

    const scaled = ingredient.quantity * scale;
    if (ingredient.name.toLowerCase() === "yeast" && scaled > yeastLimit) {
      return yeastLimit;
    }
    return scaled;
  }

  useEffect(() => {
    const hasYeastOverLimit = ingredients.some(
      (ingredient) =>
        ingredient.name.toLowerCase() === "yeast" &&
        ingredient.quantity !== undefined &&
        ingredient.quantity * scale > yeastLimit
    );
    setYeastLimitReached(hasYeastOverLimit);
  }, [ingredients, scale, yeastLimit]);

  const scaledIngredients = ingredients.map((ingredient) => ({
    ...ingredient,
    quantity: scaleQuantity(ingredient),
  }));

  return (
    <div>
      <ul className="mb-4 list-disc pl-5">
        {scaledIngredients.map((ingredient, index) => (
          <li key={index}>
            {ingredient.quantity !== undefined
              ? `${ingredient.quantity} ${ingredient.unit || ""} ${
                  ingredient.name
                }`
              : ingredient.name}{" "}
            {ingredient.note}
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <p>Recipe scale: </p>
          <p className={`min-w-8 ${scale > 1 && "text-amber-600"}`}>{scale}x</p>
          <div>
            <div className="flex items-center gap-1">
              <button
                className="bg-foreground text-background rounded-lg size-8 flex justify-center items-center text-center"
                onClick={handleScaleUp}
              >
                <Plus size={16} className="text-background" />
              </button>
              <button
                className="bg-foreground text-background justify-center rounded-lg size-8 flex items-center"
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
            * No more yeast requried after {yeastLimit}g
          </p>
        )}
      </div>
    </div>
  );
}
