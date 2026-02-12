// Grams per cup for common baking/cooking ingredients
export const INGREDIENT_DENSITIES: Record<string, { gramsPerCup: number }> = {
  // Flours
  "flour": { gramsPerCup: 120 },
  "all-purpose flour": { gramsPerCup: 120 },
  "all purpose flour": { gramsPerCup: 120 },
  "ap flour": { gramsPerCup: 120 },
  "bread flour": { gramsPerCup: 130 },
  "whole wheat flour": { gramsPerCup: 128 },
  "cake flour": { gramsPerCup: 114 },
  "pastry flour": { gramsPerCup: 114 },
  "rye flour": { gramsPerCup: 102 },
  "almond flour": { gramsPerCup: 96 },
  "coconut flour": { gramsPerCup: 112 },
  "cornstarch": { gramsPerCup: 128 },

  // Sugars
  "sugar": { gramsPerCup: 200 },
  "granulated sugar": { gramsPerCup: 200 },
  "white sugar": { gramsPerCup: 200 },
  "brown sugar": { gramsPerCup: 220 },
  "light brown sugar": { gramsPerCup: 220 },
  "dark brown sugar": { gramsPerCup: 220 },
  "powdered sugar": { gramsPerCup: 120 },
  "icing sugar": { gramsPerCup: 120 },
  "confectioners sugar": { gramsPerCup: 120 },
  "maple syrup": { gramsPerCup: 312 },
  "honey": { gramsPerCup: 340 },
  "molasses": { gramsPerCup: 328 },

  // Fats
  "butter": { gramsPerCup: 227 },
  "unsalted butter": { gramsPerCup: 227 },
  "salted butter": { gramsPerCup: 227 },
  "oil": { gramsPerCup: 218 },
  "vegetable oil": { gramsPerCup: 218 },
  "olive oil": { gramsPerCup: 216 },
  "coconut oil": { gramsPerCup: 218 },
  "shortening": { gramsPerCup: 191 },
  "lard": { gramsPerCup: 205 },

  // Dairy
  "milk": { gramsPerCup: 244 },
  "whole milk": { gramsPerCup: 244 },
  "buttermilk": { gramsPerCup: 245 },
  "heavy cream": { gramsPerCup: 238 },
  "sour cream": { gramsPerCup: 230 },
  "yogurt": { gramsPerCup: 245 },
  "cream cheese": { gramsPerCup: 232 },

  // Grains & starches
  "oats": { gramsPerCup: 80 },
  "rolled oats": { gramsPerCup: 80 },
  "rice": { gramsPerCup: 185 },
  "white rice": { gramsPerCup: 185 },
  "brown rice": { gramsPerCup: 185 },
  "breadcrumbs": { gramsPerCup: 108 },
  "panko": { gramsPerCup: 60 },
  "cornmeal": { gramsPerCup: 163 },

  // Nuts & seeds
  "almonds": { gramsPerCup: 143 },
  "walnuts": { gramsPerCup: 120 },
  "pecans": { gramsPerCup: 109 },
  "peanuts": { gramsPerCup: 146 },
  "cashews": { gramsPerCup: 137 },
  "peanut butter": { gramsPerCup: 258 },
  "sesame seeds": { gramsPerCup: 144 },
  "flax seeds": { gramsPerCup: 168 },
  "chia seeds": { gramsPerCup: 168 },

  // Chocolate
  "chocolate chips": { gramsPerCup: 170 },
  "cocoa powder": { gramsPerCup: 86 },
  "cocoa": { gramsPerCup: 86 },

  // Misc
  "salt": { gramsPerCup: 288 },
  "baking powder": { gramsPerCup: 220 },
  "baking soda": { gramsPerCup: 220 },
  "water": { gramsPerCup: 237 },
  "coconut flakes": { gramsPerCup: 85 },
  "shredded coconut": { gramsPerCup: 85 },
  "raisins": { gramsPerCup: 165 },
  "dried cranberries": { gramsPerCup: 120 },
};

export const VOLUME_RATIOS = {
  tspPerTbsp: 3,
  tbspPerCup: 16,
  mlPerCup: 236.588,
  mlPerTbsp: 14.787,
  mlPerTsp: 4.929,
  gramsPerOz: 28.3495,
  gramsPerLb: 453.592,
};
