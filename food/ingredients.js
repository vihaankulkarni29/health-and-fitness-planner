// Ingredient nutritional database
// Values per 100g unless otherwise specified
const INGREDIENT_DATABASE = {
    // Proteins - Chicken, Fish, Eggs (Indian preferences)
    'chicken breast': { calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, vitaminA: 0, vitaminC: 0, calcium: 15, iron: 1.3, potassium: 256, magnesium: 29 },
    'chicken thigh': { calories: 209, protein: 26, carbs: 0, fat: 10.9, fiber: 0, vitaminA: 0, vitaminC: 0, calcium: 11, iron: 1.1, potassium: 239, magnesium: 24 },
    'chicken drumstick': { calories: 155, protein: 24.2, carbs: 0, fat: 5.7, fiber: 0, vitaminA: 0, vitaminC: 0, calcium: 12, iron: 1.2, potassium: 218, magnesium: 21 },
    'chicken curry cut': { calories: 180, protein: 28, carbs: 0, fat: 8, fiber: 0, vitaminA: 0, vitaminC: 0, calcium: 13, iron: 1.2, potassium: 247, magnesium: 26 },
    'fish pomfret': { calories: 124, protein: 23, carbs: 0, fat: 3.5, fiber: 0, vitaminA: 0, vitaminC: 0, calcium: 45, iron: 0.8, potassium: 356, magnesium: 32 },
    'fish surmai': { calories: 136, protein: 25, carbs: 0, fat: 4.2, fiber: 0, vitaminA: 0, vitaminC: 0, calcium: 38, iron: 0.9, potassium: 387, magnesium: 35 },
    'fish bombay duck': { calories: 105, protein: 20, carbs: 0, fat: 2.8, fiber: 0, vitaminA: 0, vitaminC: 0, calcium: 42, iron: 0.7, potassium: 298, magnesium: 28 },
    'fish rohu': { calories: 97, protein: 20, carbs: 0, fat: 2.1, fiber: 0, vitaminA: 0, vitaminC: 0, calcium: 35, iron: 0.8, potassium: 312, magnesium: 29 },
    'fish katla': { calories: 105, protein: 22, carbs: 0, fat: 2.5, fiber: 0, vitaminA: 0, vitaminC: 0, calcium: 40, iron: 0.8, potassium: 334, magnesium: 31 },
    'prawns': { calories: 99, protein: 24, carbs: 0.3, fat: 0.3, fiber: 0, vitaminA: 0, vitaminC: 0, calcium: 70, iron: 0.6, potassium: 259, magnesium: 39 },
    'fish salmon': { calories: 206, protein: 22, carbs: 0, fat: 12, fiber: 0, vitaminA: 0, vitaminC: 0, calcium: 12, iron: 0.3, potassium: 363, magnesium: 29 },
    'fish tuna': { calories: 144, protein: 25, carbs: 0, fat: 4, fiber: 0, vitaminA: 0, vitaminC: 0, calcium: 8, iron: 0.6, potassium: 323, magnesium: 32 },
    'fish cod': { calories: 82, protein: 18, carbs: 0, fat: 0.7, fiber: 0, vitaminA: 0, vitaminC: 0, calcium: 16, iron: 0.1, potassium: 413, magnesium: 32 },
    'eggs': { calories: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0, vitaminA: 540, vitaminC: 0, calcium: 56, iron: 1.8, potassium: 138, magnesium: 12 },
    'egg white': { calories: 52, protein: 11, carbs: 0.7, fat: 0.2, fiber: 0, vitaminA: 0, vitaminC: 0, calcium: 7, iron: 0.1, potassium: 163, magnesium: 11 },
    'tofu': { calories: 76, protein: 8, carbs: 1.9, fat: 4.8, fiber: 0.3, vitaminA: 0, vitaminC: 0.2, calcium: 350, iron: 5.4, potassium: 121, magnesium: 30 },
    'paneer': { calories: 265, protein: 18, carbs: 3.4, fat: 20, fiber: 0, vitaminA: 0, vitaminC: 0, calcium: 208, iron: 0.1, potassium: 98, magnesium: 26 },
    'lentils cooked': { calories: 116, protein: 9, carbs: 20, fat: 0.4, fiber: 7.9, vitaminA: 8, vitaminC: 1.5, calcium: 19, iron: 3.3, potassium: 369, magnesium: 36 },
    'chickpeas cooked': { calories: 164, protein: 7.6, carbs: 27, fat: 2.6, fiber: 7.6, vitaminA: 3, vitaminC: 1.3, calcium: 49, iron: 2.9, potassium: 291, magnesium: 48 },
    'kidney beans cooked': { calories: 127, protein: 8.9, carbs: 22, fat: 0.5, fiber: 6.5, vitaminA: 0, vitaminC: 1.2, calcium: 35, iron: 2.1, potassium: 403, magnesium: 45 },
    'black beans cooked': { calories: 132, protein: 8.9, carbs: 24, fat: 0.5, fiber: 8.9, vitaminA: 0, vitaminC: 0, calcium: 35, iron: 2.1, potassium: 355, magnesium: 50 },
    'peas cooked': { calories: 81, protein: 5.4, carbs: 14, fat: 0.4, fiber: 5.7, vitaminA: 38, vitaminC: 13.2, calcium: 25, iron: 1.5, potassium: 271, magnesium: 33 },
    'moong dal cooked': { calories: 116, protein: 7.8, carbs: 20, fat: 0.4, fiber: 7.9, vitaminA: 0, vitaminC: 0.4, calcium: 29, iron: 1.8, potassium: 326, magnesium: 42 },
    'urad dal cooked': { calories: 114, protein: 8.8, carbs: 20, fat: 0.4, fiber: 6.5, vitaminA: 0, vitaminC: 0, calcium: 35, iron: 2.1, potassium: 286, magnesium: 45 },
    'chana dal cooked': { calories: 164, protein: 7.6, carbs: 27, fat: 2.6, fiber: 7.6, vitaminA: 3, vitaminC: 1.3, calcium: 49, iron: 2.9, potassium: 291, magnesium: 48 },
    'rajma cooked': { calories: 127, protein: 8.9, carbs: 22, fat: 0.5, fiber: 6.5, vitaminA: 0, vitaminC: 1.2, calcium: 35, iron: 2.1, potassium: 403, magnesium: 45 },
    'toor dal cooked': { calories: 116, protein: 7.8, carbs: 20, fat: 0.4, fiber: 7.9, vitaminA: 0, vitaminC: 0.4, calcium: 29, iron: 1.8, potassium: 326, magnesium: 42 },
    'masoor dal cooked': { calories: 116, protein: 9, carbs: 20, fat: 0.4, fiber: 7.9, vitaminA: 0, vitaminC: 0, calcium: 19, iron: 3.3, potassium: 369, magnesium: 36 },
    'chole cooked': { calories: 164, protein: 7.6, carbs: 27, fat: 2.6, fiber: 7.6, vitaminA: 3, vitaminC: 1.3, calcium: 49, iron: 2.9, potassium: 291, magnesium: 48 },

    // Dairy
    'milk cow': { calories: 61, protein: 3.2, carbs: 4.8, fat: 3.3, fiber: 0, vitaminA: 162, vitaminC: 0, calcium: 119, iron: 0.1, potassium: 150, magnesium: 12 },
    'milk buffalo': { calories: 97, protein: 3.8, carbs: 5, fat: 6.5, fiber: 0, vitaminA: 176, vitaminC: 0, calcium: 195, iron: 0.1, potassium: 178, magnesium: 18 },
    'curd': { calories: 61, protein: 3.1, carbs: 4.6, fat: 4, fiber: 0, vitaminA: 162, vitaminC: 0, calcium: 119, iron: 0.1, potassium: 150, magnesium: 12 },
    'yogurt plain': { calories: 61, protein: 3.5, carbs: 4.7, fat: 3.3, fiber: 0, vitaminA: 162, vitaminC: 0, calcium: 121, iron: 0.1, potassium: 155, magnesium: 12 },
    'cheese cheddar': { calories: 402, protein: 7, carbs: 3.4, fat: 33, fiber: 0, vitaminA: 1002, vitaminC: 0, calcium: 721, iron: 0.7, potassium: 98, magnesium: 28 },
    'cheese mozzarella': { calories: 280, protein: 17.1, carbs: 3.1, fat: 17.1, fiber: 0, vitaminA: 676, vitaminC: 0, calcium: 575, iron: 0.4, potassium: 76, magnesium: 21 },
    'butter': { calories: 717, protein: 0.9, carbs: 0.1, fat: 81, fiber: 0, vitaminA: 2499, vitaminC: 0, calcium: 24, iron: 0.1, potassium: 24, magnesium: 2 },
    'ghee': { calories: 900, protein: 0, carbs: 0, fat: 100, fiber: 0, vitaminA: 2800, vitaminC: 0, calcium: 0, iron: 0, potassium: 0, magnesium: 0 },
    'cream': { calories: 340, protein: 2.1, carbs: 4.1, fat: 35, fiber: 0, vitaminA: 1242, vitaminC: 0, calcium: 101, iron: 0.1, potassium: 132, magnesium: 10 },

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
    'okra bhindi': { calories: 33, protein: 1.9, carbs: 7.5, fat: 0.2, fiber: 3.2 },
    'eggplant baingan': { calories: 25, protein: 1, carbs: 6, fat: 0.2, fiber: 3.4 },
    'bitter gourd karela': { calories: 17, protein: 1, carbs: 3.7, fat: 0.2, fiber: 2.6 },
    'bottle gourd lauki': { calories: 14, protein: 0.6, carbs: 3.4, fat: 0.1, fiber: 1.2 },
    'ridge gourd torai': { calories: 20, protein: 0.7, carbs: 4.4, fat: 0.1, fiber: 1.3 },
    'drumstick saijan': { calories: 37, protein: 2.1, carbs: 8.5, fat: 0.1, fiber: 3.2 },
    'potato aloo': { calories: 77, protein: 2, carbs: 17, fat: 0.1, fiber: 2.2 },
    'onion pyaz': { calories: 40, protein: 1.1, carbs: 9.3, fat: 0.1, fiber: 1.7 },
    'tomato tamatar': { calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2 },
    'cucumber kheera': { calories: 15, protein: 0.7, carbs: 3.6, fat: 0.1, fiber: 0.5 },
    'spinach palak': { calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2 },
    'fenugreek leaves methi': { calories: 49, protein: 4.4, carbs: 6, fat: 0.9, fiber: 6.4 },
    'coriander leaves dhania': { calories: 23, protein: 2.1, carbs: 3.7, fat: 0.5, fiber: 2.8 },
    'curry leaves kadi patta': { calories: 108, protein: 6.1, carbs: 18.7, fat: 1, fiber: 6.4 },
    'green chili hari mirch': { calories: 40, protein: 2, carbs: 9, fat: 0.2, fiber: 1.5 },
    'garlic lehsun': { calories: 149, protein: 6.4, carbs: 33, fat: 0.5, fiber: 2.1 },
    'ginger adrak': { calories: 80, protein: 1.8, carbs: 18, fat: 0.8, fiber: 2 },
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

    // Grains & Cereals - Indian staples
    'rice white cooked': { calories: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4 },
    'rice brown cooked': { calories: 111, protein: 2.6, carbs: 23, fat: 0.9, fiber: 1.8 },
    'wheat flour': { calories: 361, protein: 12, carbs: 76, fat: 1.5, fiber: 12.2 },
    'whole wheat flour': { calories: 340, protein: 13, carbs: 72, fat: 2.5, fiber: 12.2 },
    'atta whole wheat': { calories: 340, protein: 13, carbs: 72, fat: 2.5, fiber: 12.2 },
    'chapati atta': { calories: 340, protein: 13, carbs: 72, fat: 2.5, fiber: 12.2 },
    'oats': { calories: 379, protein: 13.2, carbs: 66, fat: 6.9, fiber: 10.6 },
    'quinoa cooked': { calories: 120, protein: 4.4, carbs: 21, fat: 1.9, fiber: 2.8 },
    'barley': { calories: 354, protein: 12.5, carbs: 73, fat: 2.3, fiber: 17.3 },
    'millet': { calories: 378, protein: 11, carbs: 73, fat: 4.2, fiber: 8.5 },
    'corn': { calories: 86, protein: 3.3, carbs: 19, fat: 1.4, fiber: 2.7 },
    'popcorn': { calories: 387, protein: 12.9, carbs: 78, fat: 4.5, fiber: 14.5 },
    'maize': { calories: 86, protein: 3.3, carbs: 19, fat: 1.4, fiber: 2.7 },

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
    'flax seeds': { calories: 534, protein: 18, carbs: 29, fat: 42, fiber: 27.3 },

    // Indian Foods & Staples
    'chapati': { calories: 297, protein: 7.3, carbs: 46, fat: 7.5, fiber: 3.2 },
    'roti': { calories: 297, protein: 7.3, carbs: 46, fat: 7.5, fiber: 3.2 },
    'paratha': { calories: 360, protein: 8.5, carbs: 52, fat: 12, fiber: 3.5 },
    'puri': { calories: 320, protein: 6.8, carbs: 48, fat: 10, fiber: 2.8 },
    'khichdi': { calories: 180, protein: 5.2, carbs: 32, fat: 3.5, fiber: 2.1 },
    'poha': { calories: 160, protein: 3.8, carbs: 28, fat: 2.5, fiber: 1.8 },
    'upma': { calories: 190, protein: 4.5, carbs: 30, fat: 4.2, fiber: 2.3 },
    'idli': { calories: 135, protein: 4.2, carbs: 26, fat: 0.8, fiber: 1.5 },
    'dosa': { calories: 165, protein: 4.8, carbs: 28, fat: 2.1, fiber: 2.2 },
    'uttapam': { calories: 155, protein: 5.2, carbs: 26, fat: 1.8, fiber: 2.0 },
    'sambar': { calories: 95, protein: 4.8, carbs: 12, fat: 2.5, fiber: 3.2 },
    'rasam': { calories: 45, protein: 2.1, carbs: 8, fat: 0.8, fiber: 1.2 },
    'butter chicken': { calories: 320, protein: 28, carbs: 12, fat: 18, fiber: 1.5 },
    'chicken curry': { calories: 280, protein: 25, carbs: 8, fat: 15, fiber: 2.1 },
    'fish curry': { calories: 220, protein: 22, carbs: 6, fat: 12, fiber: 1.8 },
    'egg curry': { calories: 180, protein: 12, carbs: 8, fat: 10, fiber: 1.2 },
    'palak paneer': { calories: 220, protein: 10, carbs: 12, fat: 14, fiber: 3.5 },
    'chole masala': { calories: 240, protein: 8.5, carbs: 35, fat: 8, fiber: 8.2 },
    'rajma masala': { calories: 220, protein: 9.2, carbs: 32, fat: 6, fiber: 7.8 },
    'dal tadka': { calories: 180, protein: 8.5, carbs: 25, fat: 6, fiber: 6.2 },
    'dal makhani': { calories: 250, protein: 9.8, carbs: 28, fat: 12, fiber: 7.5 },
    'mixed vegetable curry': { calories: 120, protein: 3.2, carbs: 18, fat: 4.5, fiber: 4.8 },
    'aloo gobi': { calories: 140, protein: 3.8, carbs: 22, fat: 5, fiber: 3.2 },
    'bhindi masala': { calories: 110, protein: 2.8, carbs: 15, fat: 4.2, fiber: 4.5 },
    'baingan bharta': { calories: 130, protein: 2.5, carbs: 16, fat: 6, fiber: 3.8 },
    'cucumber raita': { calories: 65, protein: 2.8, carbs: 8, fat: 2.5, fiber: 1.2 },
    'boondi raita': { calories: 120, protein: 4.2, carbs: 15, fat: 5, fiber: 0.8 },
    'onion pakora': { calories: 280, protein: 5.2, carbs: 32, fat: 14, fiber: 3.5 },
    'aloo tikki': { calories: 220, protein: 4.8, carbs: 28, fat: 10, fiber: 4.2 },
    'samosa': { calories: 250, protein: 5.5, carbs: 32, fat: 12, fiber: 2.8 },
    'kachori': { calories: 320, protein: 6.8, carbs: 38, fat: 16, fiber: 3.2 },
    'bhelpuri': { calories: 180, protein: 4.2, carbs: 28, fat: 6, fiber: 3.5 },
    'pani puri': { calories: 120, protein: 2.8, carbs: 22, fat: 2.5, fiber: 2.2 },
    'dhokla': { calories: 140, protein: 4.5, carbs: 24, fat: 1.8, fiber: 1.5 },
    'khakra': { calories: 180, protein: 6.2, carbs: 28, fat: 5, fiber: 4.8 },
    'mathri': { calories: 290, protein: 5.8, carbs: 35, fat: 14, fiber: 3.2 },
    'namak pare': { calories: 270, protein: 4.8, carbs: 32, fat: 12, fiber: 2.5 },
    'besan laddoo': { calories: 320, protein: 8.5, carbs: 38, fat: 14, fiber: 4.2 },
    'jalebi': { calories: 380, protein: 4.2, carbs: 65, fat: 12, fiber: 1.8 },
    'gulab jamun': { calories: 280, protein: 3.8, carbs: 45, fat: 8, fiber: 1.2 },
    'ras malai': { calories: 150, protein: 4.2, carbs: 22, fat: 5, fiber: 0.5 },
    'kulfi': { calories: 220, protein: 5.8, carbs: 28, fat: 10, fiber: 0.8 },
    'lassi sweet': { calories: 180, protein: 6.2, carbs: 24, fat: 7, fiber: 0.5 },
    'masala chai': { calories: 120, protein: 2.8, carbs: 18, fat: 3.5, fiber: 1.2 },
    'filter coffee': { calories: 80, protein: 1.2, carbs: 12, fat: 2, fiber: 0.3 },
    'nimbu pani': { calories: 35, protein: 0.5, carbs: 8, fat: 0.2, fiber: 0.8 },
    'jal jeera': { calories: 25, protein: 0.8, carbs: 5, fat: 0.5, fiber: 1.2 },
    'kokum sharbat': { calories: 45, protein: 0.3, carbs: 10, fat: 0.2, fiber: 0.8 },
    'aam panna': { calories: 120, protein: 1.2, carbs: 28, fat: 0.8, fiber: 2.5 },
    'falooda': { calories: 220, protein: 4.8, carbs: 38, fat: 6, fiber: 1.8 },
    'kulhad chai': { calories: 95, protein: 2.2, carbs: 15, fat: 2.8, fiber: 0.8 }
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
        fiber: Math.round(ingredient.fiber * multiplier * 10) / 10,
        vitaminA: Math.round((ingredient.vitaminA || 0) * multiplier),
        vitaminC: Math.round((ingredient.vitaminC || 0) * multiplier * 10) / 10,
        calcium: Math.round((ingredient.calcium || 0) * multiplier),
        iron: Math.round((ingredient.iron || 0) * multiplier * 10) / 10,
        potassium: Math.round((ingredient.potassium || 0) * multiplier),
        magnesium: Math.round((ingredient.magnesium || 0) * multiplier)
    };
}

// Function to calculate total nutrition for a recipe
function calculateRecipeNutrition(ingredients) {
    let total = {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0,
        vitaminA: 0,
        vitaminC: 0,
        calcium: 0,
        iron: 0,
        potassium: 0,
        magnesium: 0
    };

    ingredients.forEach(ing => {
        const nutrition = calculateNutrition(ing.name, ing.quantity);
        if (nutrition) {
            total.calories += nutrition.calories;
            total.protein += nutrition.protein;
            total.carbs += nutrition.carbs;
            total.fat += nutrition.fat;
            total.fiber += nutrition.fiber;
            total.vitaminA += nutrition.vitaminA;
            total.vitaminC += nutrition.vitaminC;
            total.calcium += nutrition.calcium;
            total.iron += nutrition.iron;
            total.potassium += nutrition.potassium;
            total.magnesium += nutrition.magnesium;
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