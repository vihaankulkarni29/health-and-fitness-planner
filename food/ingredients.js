// Ingredient nutritional database
// Values per 100g unless otherwise specified
const INGREDIENT_DATABASE = {
    // Proteins
    'chicken breast': { calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0 },
    'chicken thigh': { calories: 209, protein: 26, carbs: 0, fat: 10.9, fiber: 0 },
    'chicken drumstick': { calories: 155, protein: 24.2, carbs: 0, fat: 5.7, fiber: 0 },
    'turkey breast': { calories: 135, protein: 30, carbs: 0, fat: 1, fiber: 0 },
    'turkey thigh': { calories: 135, protein: 21, carbs: 0, fat: 5, fiber: 0 },
    'beef ground': { calories: 179, protein: 20, carbs: 0, fat: 10, fiber: 0 },
    'beef sirloin': { calories: 171, protein: 26, carbs: 0, fat: 7, fiber: 0 },
    'pork loin': { calories: 143, protein: 21, carbs: 0, fat: 5, fiber: 0 },
    'pork chop': { calories: 173, protein: 25, carbs: 0, fat: 7, fiber: 0 },
    'fish salmon': { calories: 206, protein: 22, carbs: 0, fat: 12, fiber: 0 },
    'fish tuna': { calories: 144, protein: 25, carbs: 0, fat: 4, fiber: 0 },
    'fish cod': { calories: 82, protein: 18, carbs: 0, fat: 0.7, fiber: 0 },
    'eggs': { calories: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0 },
    'egg white': { calories: 52, protein: 11, carbs: 0.7, fat: 0.2, fiber: 0 },
    'tofu': { calories: 76, protein: 8, carbs: 1.9, fat: 4.8, fiber: 0.3 },
    'paneer': { calories: 265, protein: 18, carbs: 3.4, fat: 20, fiber: 0 },
    'lentils': { calories: 116, protein: 9, carbs: 20, fat: 0.4, fiber: 7.9 },
    'chickpeas': { calories: 164, protein: 7.6, carbs: 27, fat: 2.6, fiber: 7.6 },
    'kidney beans': { calories: 127, protein: 8.9, carbs: 22, fat: 0.5, fiber: 6.5 },
    'black beans': { calories: 132, protein: 8.9, carbs: 24, fat: 0.5, fiber: 8.9 },
    'peas': { calories: 81, protein: 5.4, carbs: 14, fat: 0.4, fiber: 5.7 },
    'moong dal': { calories: 347, protein: 24, carbs: 63, fat: 1.2, fiber: 8.2 },
    'urad dal': { calories: 341, protein: 26, carbs: 59, fat: 1.4, fiber: 18.3 },
    'chana dal': { calories: 372, protein: 20, carbs: 67, fat: 6, fiber: 12.2 },
    'rajma': { calories: 127, protein: 8.9, carbs: 22, fat: 0.5, fiber: 6.5 },

    // Dairy
    'milk cow': { calories: 61, protein: 3.2, carbs: 4.8, fat: 3.3, fiber: 0 },
    'milk buffalo': { calories: 97, protein: 3.8, carbs: 5, fat: 6.5, fiber: 0 },
    'curd': { calories: 61, protein: 3.1, carbs: 4.6, fat: 4, fiber: 0 },
    'yogurt plain': { calories: 61, protein: 3.5, carbs: 4.7, fat: 3.3, fiber: 0 },
    'cheese cheddar': { calories: 402, protein: 7, carbs: 3.4, fat: 33, fiber: 0 },
    'cheese mozzarella': { calories: 280, protein: 17.1, carbs: 3.1, fat: 17.1, fiber: 0 },
    'butter': { calories: 717, protein: 0.9, carbs: 0.1, fat: 81, fiber: 0 },
    'ghee': { calories: 900, protein: 0, carbs: 0, fat: 100, fiber: 0 },
    'cream': { calories: 340, protein: 2.1, carbs: 4.1, fat: 35, fiber: 0 },

    // Vegetables
    'onion': { calories: 40, protein: 1.1, carbs: 9.3, fat: 0.1, fiber: 1.7 },
    'tomato': { calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2 },
    'potato': { calories: 77, protein: 2, carbs: 17, fat: 0.1, fiber: 2.2 },
    'sweet potato': { calories: 86, protein: 1.6, carbs: 20, fat: 0.1, fiber: 3 },
    'carrot': { calories: 41, protein: 0.9, carbs: 10, fat: 0.2, fiber: 2.8 },
    'spinach': { calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2 },
    'lettuce': { calories: 15, protein: 1.4, carbs: 2.9, fat: 0.2, fiber: 1.3 },
    'cucumber': { calories: 15, protein: 0.7, carbs: 3.6, fat: 0.1, fiber: 0.5 },
    'bell pepper': { calories: 31, protein: 1, carbs: 6, fat: 0.3, fiber: 2.1 },
    'broccoli': { calories: 34, protein: 2.8, carbs: 7, fat: 0.4, fiber: 2.6 },
    'cauliflower': { calories: 25, protein: 1.9, carbs: 5, fat: 0.3, fiber: 2 },
    'cabbage': { calories: 25, protein: 1.3, carbs: 5.8, fat: 0.1, fiber: 2.5 },
    'okra': { calories: 33, protein: 1.9, carbs: 7.5, fat: 0.2, fiber: 3.2 },
    'eggplant': { calories: 25, protein: 1, carbs: 6, fat: 0.2, fiber: 3.4 },
    'bitter gourd': { calories: 17, protein: 1, carbs: 3.7, fat: 0.2, fiber: 2.6 },
    'bottle gourd': { calories: 14, protein: 0.6, carbs: 3.4, fat: 0.1, fiber: 1.2 },
    'ridge gourd': { calories: 20, protein: 0.7, carbs: 4.4, fat: 0.1, fiber: 1.3 },
    'drumstick': { calories: 37, protein: 2.1, carbs: 8.5, fat: 0.1, fiber: 3.2 },
    'fenugreek leaves': { calories: 49, protein: 4.4, carbs: 6, fat: 0.9, fiber: 6.4 },
    'coriander leaves': { calories: 23, protein: 2.1, carbs: 3.7, fat: 0.5, fiber: 2.8 },
    'curry leaves': { calories: 108, protein: 6.1, carbs: 18.7, fat: 1, fiber: 6.4 },
    'garlic': { calories: 149, protein: 6.4, carbs: 33, fat: 0.5, fiber: 2.1 },
    'ginger': { calories: 80, protein: 1.8, carbs: 18, fat: 0.8, fiber: 2 },
    'green chili': { calories: 40, protein: 2, carbs: 9, fat: 0.2, fiber: 1.5 },

    // Fruits
    'apple': { calories: 52, protein: 0.3, carbs: 14, fat: 0.2, fiber: 2.4 },
    'banana': { calories: 89, protein: 1.1, carbs: 23, fat: 0.3, fiber: 2.6 },
    'orange': { calories: 47, protein: 0.9, carbs: 12, fat: 0.1, fiber: 2.4 },
    'grapes': { calories: 69, protein: 0.7, carbs: 18, fat: 0.2, fiber: 0.9 },
    'mango': { calories: 60, protein: 0.8, carbs: 15, fat: 0.4, fiber: 1.6 },
    'papaya': { calories: 43, protein: 0.5, carbs: 11, fat: 0.3, fiber: 2.5 },
    'pineapple': { calories: 50, protein: 0.5, carbs: 13, fat: 0.1, fiber: 1.4 },
    'watermelon': { calories: 30, protein: 0.6, carbs: 8, fat: 0.2, fiber: 0.4 },
    'strawberry': { calories: 32, protein: 0.7, carbs: 7.7, fat: 0.3, fiber: 2 },
    'guava': { calories: 68, protein: 2.6, carbs: 14, fat: 0.9, fiber: 5.4 },
    'pomegranate': { calories: 83, protein: 1.7, carbs: 19, fat: 1.2, fiber: 4 },
    'lemon': { calories: 29, protein: 1.1, carbs: 9, fat: 0.3, fiber: 2.8 },

    // Grains & Cereals
    'rice white': { calories: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4 },
    'rice brown': { calories: 111, protein: 2.6, carbs: 23, fat: 0.9, fiber: 1.8 },
    'wheat flour': { calories: 361, protein: 12, carbs: 76, fat: 1.5, fiber: 12.2 },
    'whole wheat flour': { calories: 340, protein: 13, carbs: 72, fat: 2.5, fiber: 12.2 },
    'oats': { calories: 379, protein: 13.2, carbs: 66, fat: 6.9, fiber: 10.6 },
    'quinoa': { calories: 368, protein: 14, carbs: 64, fat: 6, fiber: 7 },
    'barley': { calories: 354, protein: 12.5, carbs: 73, fat: 2.3, fiber: 17.3 },
    'millet': { calories: 378, protein: 11, carbs: 73, fat: 4.2, fiber: 8.5 },
    'corn': { calories: 86, protein: 3.3, carbs: 19, fat: 1.4, fiber: 2.7 },
    'popcorn': { calories: 387, protein: 12.9, carbs: 78, fat: 4.5, fiber: 14.5 },

    // Nuts & Seeds
    'almonds': { calories: 579, protein: 21, carbs: 22, fat: 50, fiber: 12.5 },
    'walnuts': { calories: 654, protein: 15, carbs: 14, fat: 65, fiber: 6.7 },
    'peanuts': { calories: 567, protein: 26, carbs: 16, fat: 49, fiber: 8.5 },
    'cashews': { calories: 553, protein: 18, carbs: 30, fat: 44, fiber: 3.3 },
    'pistachios': { calories: 562, protein: 20, carbs: 28, fat: 45, fiber: 10.6 },
    'chia seeds': { calories: 486, protein: 17, carbs: 42, fat: 31, fiber: 34.4 },
    'flax seeds': { calories: 534, protein: 18, carbs: 29, fat: 42, fiber: 27.3 },
    'sunflower seeds': { calories: 584, protein: 21, carbs: 20, fat: 51, fiber: 8.6 },
    'pumpkin seeds': { calories: 446, protein: 19, carbs: 54, fat: 19, fiber: 18.4 },

    // Oils & Fats
    'olive oil': { calories: 884, protein: 0, carbs: 0, fat: 100, fiber: 0 },
    'coconut oil': { calories: 862, protein: 0, carbs: 0, fat: 100, fiber: 0 },
    'mustard oil': { calories: 884, protein: 0, carbs: 0, fat: 100, fiber: 0 },
    'sunflower oil': { calories: 884, protein: 0, carbs: 0, fat: 100, fiber: 0 },
    'vegetable oil': { calories: 884, protein: 0, carbs: 0, fat: 100, fiber: 0 },

    // Spices & Herbs
    'cumin seeds': { calories: 375, protein: 17.8, carbs: 44.2, fat: 22.3, fiber: 10.5 },
    'coriander seeds': { calories: 298, protein: 12.4, carbs: 54.9, fat: 17.8, fiber: 41.9 },
    'turmeric': { calories: 312, protein: 9.7, carbs: 67.1, fat: 3.3, fiber: 22.7 },
    'red chili powder': { calories: 282, protein: 13.4, carbs: 49.7, fat: 13.9, fiber: 34.8 },
    'black pepper': { calories: 251, protein: 10.4, carbs: 64, fat: 3.3, fiber: 25.3 },
    'cardamom': { calories: 311, protein: 10.8, carbs: 68.5, fat: 6.7, fiber: 28 },
    'cinnamon': { calories: 247, protein: 4, carbs: 81, fat: 1.2, fiber: 53.1 },
    'cloves': { calories: 274, protein: 6, carbs: 65, fat: 13, fiber: 33.9 },
    'bay leaves': { calories: 313, protein: 7.6, carbs: 75, fat: 8.4, fiber: 26.3 },

    // Common Cooking Ingredients
    'salt': { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
    'sugar': { calories: 387, protein: 0, carbs: 100, fat: 0, fiber: 0 },
    'honey': { calories: 304, protein: 0.3, carbs: 82, fat: 0, fiber: 0.2 },
    'jaggery': { calories: 383, protein: 0.4, carbs: 95, fat: 0.1, fiber: 0.2 },
    'vinegar': { calories: 18, protein: 0, carbs: 0.9, fat: 0, fiber: 0 },
    'soy sauce': { calories: 53, protein: 8.1, carbs: 4.9, fat: 0.6, fiber: 0.8 },
    'tomato sauce': { calories: 32, protein: 1.9, carbs: 7.3, fat: 0.3, fiber: 1.5 },
    'coconut milk': { calories: 230, protein: 0.5, carbs: 5.5, fat: 24, fiber: 0.9 },

    // Individual Foods (Common items you might weigh)
    'apple': { calories: 52, protein: 0.3, carbs: 14, fat: 0.2, fiber: 2.4 },
    'banana': { calories: 89, protein: 1.1, carbs: 23, fat: 0.3, fiber: 2.6 },
    'orange': { calories: 47, protein: 0.9, carbs: 12, fat: 0.1, fiber: 2.4 },
    'dates': { calories: 282, protein: 2.5, carbs: 75, fat: 0.4, fiber: 6.7 },
    'almonds': { calories: 579, protein: 21, carbs: 22, fat: 50, fiber: 12.5 },
    'walnuts': { calories: 654, protein: 15, carbs: 14, fat: 65, fiber: 6.7 },
    'cashews': { calories: 553, protein: 18, carbs: 30, fat: 44, fiber: 3.3 },
    'peanuts': { calories: 567, protein: 26, carbs: 16, fat: 49, fiber: 8.5 },
    'raisins': { calories: 299, protein: 3.1, carbs: 79, fat: 0.5, fiber: 3.7 },
    'strawberries': { calories: 32, protein: 0.7, carbs: 7.7, fat: 0.3, fiber: 2 },
    'blueberries': { calories: 57, protein: 0.7, carbs: 14, fat: 0.3, fiber: 2.4 },
    'grapes': { calories: 69, protein: 0.7, carbs: 18, fat: 0.2, fiber: 0.9 },
    'mango': { calories: 60, protein: 0.8, carbs: 15, fat: 0.4, fiber: 1.6 },
    'pineapple': { calories: 50, protein: 0.5, carbs: 13, fat: 0.1, fiber: 1.4 },
    'kiwi': { calories: 42, protein: 0.8, carbs: 10, fat: 0.4, fiber: 3 },
    'pear': { calories: 57, protein: 0.4, carbs: 15, fat: 0.1, fiber: 3.1 },
    'peach': { calories: 39, protein: 0.9, carbs: 10, fat: 0.3, fiber: 1.5 },
    'plum': { calories: 46, protein: 0.7, carbs: 11, fat: 0.3, fiber: 1.4 },
    'carrot': { calories: 41, protein: 0.9, carbs: 10, fat: 0.2, fiber: 2.8 },
    'tomato': { calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2 },
    'cucumber': { calories: 15, protein: 0.7, carbs: 3.6, fat: 0.1, fiber: 0.5 },
    'lettuce': { calories: 15, protein: 1.4, carbs: 2.9, fat: 0.2, fiber: 1.3 },
    'spinach': { calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2 },
    'broccoli': { calories: 34, protein: 2.8, carbs: 7, fat: 0.4, fiber: 2.6 },
    'cauliflower': { calories: 25, protein: 1.9, carbs: 5, fat: 0.3, fiber: 2 },
    'potato': { calories: 77, protein: 2, carbs: 17, fat: 0.1, fiber: 2.2 },
    'sweet potato': { calories: 86, protein: 1.6, carbs: 20, fat: 0.1, fiber: 3.8 },
    'onion': { calories: 40, protein: 1.1, carbs: 9.3, fat: 0.1, fiber: 1.7 },
    'garlic': { calories: 149, protein: 6.4, carbs: 33, fat: 0.5, fiber: 2.1 },
    'ginger': { calories: 80, protein: 1.8, carbs: 18, fat: 0.8, fiber: 2 },
    'lemon': { calories: 29, protein: 1.1, carbs: 9.3, fat: 0.3, fiber: 2.8 },
    'coconut': { calories: 354, protein: 3.3, carbs: 15, fat: 33, fiber: 9 },
    'dark chocolate': { calories: 546, protein: 7.8, carbs: 46, fat: 31, fiber: 10.9 },
    'milk chocolate': { calories: 535, protein: 7.7, carbs: 59, fat: 30, fiber: 3.4 },
    'honey': { calories: 304, protein: 0.3, carbs: 82, fat: 0, fiber: 0.2 },
    'peanut butter': { calories: 588, protein: 25, carbs: 20, fat: 50, fiber: 6 },
    'cheese slices': { calories: 402, protein: 7, carbs: 3.4, fat: 33, fiber: 0 },
    'yogurt plain': { calories: 61, protein: 3.5, carbs: 4.7, fat: 3.3, fiber: 0 },
    'eggs': { calories: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0 },
    'bread white': { calories: 265, protein: 9, carbs: 49, fat: 3.2, fiber: 2.7 },
    'bread whole wheat': { calories: 247, protein: 13, carbs: 41, fat: 4.2, fiber: 6.8 },
    'rice cooked': { calories: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4 },
    'quinoa cooked': { calories: 120, protein: 4.4, carbs: 21, fat: 1.9, fiber: 2.8 },
    'oats': { calories: 379, protein: 13, carbs: 67, fat: 6.9, fiber: 10.6 },
    'chia seeds': { calories: 486, protein: 17, carbs: 42, fat: 31, fiber: 34.4 },
    'flax seeds': { calories: 534, protein: 18, carbs: 29, fat: 42, fiber: 27.3 }
};

// Function to find ingredient by name (case insensitive partial match)
function findIngredient(searchTerm) {
    const term = searchTerm.toLowerCase().trim();
    const matches = [];

    for (const [key, value] of Object.entries(INGREDIENT_DATABASE)) {
        if (key.toLowerCase().includes(term)) {
            matches.push({ name: key, ...value });
        }
    }

    return matches;
}

// Function to get exact ingredient match
function getIngredient(name) {
    const key = name.toLowerCase().trim();
    return INGREDIENT_DATABASE[key] || null;
}

// Function to calculate nutrition for given ingredient and quantity
function calculateNutrition(ingredientName, quantity) {
    const ingredient = getIngredient(ingredientName);
    if (!ingredient) return null;

    const multiplier = quantity / 100; // Database values are per 100g

    return {
        name: ingredientName,
        quantity: quantity,
        calories: Math.round(ingredient.calories * multiplier),
        protein: Math.round(ingredient.protein * multiplier * 10) / 10,
        carbs: Math.round(ingredient.carbs * multiplier * 10) / 10,
        fat: Math.round(ingredient.fat * multiplier * 10) / 10,
        fiber: Math.round(ingredient.fiber * multiplier * 10) / 10
    };
}

// Function to calculate total nutrition for a recipe
function calculateRecipeNutrition(ingredients) {
    let total = {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0
    };

    ingredients.forEach(ing => {
        const nutrition = calculateNutrition(ing.name, ing.quantity);
        if (nutrition) {
            total.calories += nutrition.calories;
            total.protein += nutrition.protein;
            total.carbs += nutrition.carbs;
            total.fat += nutrition.fat;
            total.fiber += nutrition.fiber;
        }
    });

    return total;
}

// Export for use in HTML
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        INGREDIENT_DATABASE,
        findIngredient,
        getIngredient,
        calculateNutrition,
        calculateRecipeNutrition
    };
}