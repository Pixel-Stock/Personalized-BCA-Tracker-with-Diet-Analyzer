// src/lib/engines/nutritionEngine.ts
// Pure formula-based nutrition plan generator — no AI, no external APIs

import type { Assessment, DietaryProfile, Gender, Goal, Member, NutritionPlan, TrainingLevel } from '@/types'

// ── Harris-Benedict BMR ──────────────────────────────────────────────────────
function calculateBMR(weight: number, height: number, age: number, gender: Gender): number {
  if (gender === 'MALE') {
    return 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age
  } else {
    // FEMALE or OTHER — use female formula as default
    return 447.593 + 9.247 * weight + 3.098 * height - 4.33 * age
  }
}

// ── Activity multipliers ──────────────────────────────────────────────────────
const ACTIVITY_MULTIPLIERS: Record<TrainingLevel, number> = {
  BEGINNER: 1.375,
  INTERMEDIATE: 1.55,
  ADVANCED: 1.725,
}

// ── Goal calorie adjustments ──────────────────────────────────────────────────
const GOAL_ADJUSTMENTS: Record<Goal, number> = {
  FAT_LOSS: -400,
  MUSCLE_GAIN: 300,
  RECOMPOSITION: -100,
  MAINTENANCE: 0,
}

// ── Macro splits (protein%, carbs%, fat%) ───────────────────────────────────
const MACRO_SPLITS: Record<Goal, { protein: number; carbs: number; fat: number }> = {
  FAT_LOSS:      { protein: 0.35, carbs: 0.35, fat: 0.30 },
  MUSCLE_GAIN:   { protein: 0.30, carbs: 0.45, fat: 0.25 },
  RECOMPOSITION: { protein: 0.40, carbs: 0.35, fat: 0.25 },
  MAINTENANCE:   { protein: 0.25, carbs: 0.50, fat: 0.25 },
}

// ── Meal pools by diet type ──────────────────────────────────────────────────
const MEAL_POOLS: Record<string, string[]> = {
  VEGETARIAN: [
    'Paneer tikka with mint chutney (breakfast)',
    'Dal tadka with brown rice (lunch)',
    'Greek yogurt with mixed berries and nuts (snack)',
    'Tofu stir-fry with colourful vegetables and quinoa (dinner)',
    'Sprout chaat with lemon and spices (snack)',
    'Aloo gobi sabzi with 2 rotis (lunch)',
    'Masala oats with vegetables (breakfast)',
    'Palak paneer with multigrain roti (dinner)',
    'Rajma curry with brown rice (lunch)',
    'Banana with peanut butter (snack)',
  ],
  VEGAN: [
    'Overnight oat bowl with chia seeds and almond milk (breakfast)',
    'Chickpea curry with brown rice (lunch)',
    'Lentil soup with toasted whole grain bread (dinner)',
    'Tofu scramble with bell peppers and turmeric (breakfast)',
    'Quinoa salad with roasted vegetables and tahini dressing (lunch)',
    'Black bean tacos with avocado and salsa (dinner)',
    'Fruit smoothie bowl with granola and seeds (breakfast)',
    'Edamame and mixed vegetable stir-fry (snack)',
    'Tempeh curry with cauliflower rice (dinner)',
    'Apple slices with almond butter (snack)',
  ],
  NON_VEGETARIAN: [
    'Grilled chicken breast with steamed broccoli (lunch)',
    'Egg white omelette with spinach and mushrooms (breakfast)',
    'Fish curry with brown rice (dinner)',
    'Turkey wrap with lettuce, tomato, and hummus (lunch)',
    'Chicken dal with 2 multigrain rotis (dinner)',
    'Boiled eggs with whole wheat toast (breakfast)',
    'Tuna salad with mixed greens (lunch)',
    'Grilled salmon with roasted sweet potato (dinner)',
    'Chicken soup with vegetables (lunch)',
    'Greek yogurt with walnuts and honey (snack)',
  ],
  EGGETARIAN: [
    'Egg white omelette with spinach and mushrooms (breakfast)',
    'Paneer bhurji with whole wheat toast (breakfast)',
    'Dal makhani with 2 rotis (lunch)',
    'Egg curry with brown rice (dinner)',
    'Boiled egg salad with cucumbers and tomatoes (snack)',
    'Greek yogurt parfait with granola (breakfast)',
    'Veggie egg fried rice (lunch)',
    'Masala dosa with sambar (lunch)',
    'Scrambled eggs with whole grain toast (breakfast)',
    'Fruit bowl with low-fat paneer (snack)',
  ],
  PESCATARIAN: [
    'Grilled salmon with quinoa and asparagus (dinner)',
    'Tuna salad sandwich on whole wheat bread (lunch)',
    'Prawn stir-fry with vegetables and noodles (dinner)',
    'Fish tacos with coleslaw and avocado (lunch)',
    'Greek yogurt with nuts and seeds (breakfast)',
    'Mackerel on whole grain toast (breakfast)',
    'Seafood pasta with tomato sauce (dinner)',
    'Grilled shrimp salad (lunch)',
    'Salmon sushi rolls (lunch)',
    'Dal with whole wheat chapati (dinner)',
  ],
  JAIN: [
    'Moong dal chilla with green chutney (breakfast) — no onion/garlic',
    'Lauki (bottle gourd) sabzi with 2 phulkas (lunch) — no root vegetables',
    'Dalia (cracked wheat) khichdi with ghee (dinner) — Jain friendly',
    'Rajma (without onion/garlic) with jeera rice (lunch)',
    'Fruit chaat with lemon and black salt (snack)',
    'Methi thepla with low-fat curd (breakfast)',
    'Tindora stir-fry with chapati (lunch) — no onion',
    'Sabudana khichdi with peanuts and curry leaves (breakfast)',
    'Green pea curry with brown rice (dinner) — no onion/garlic',
    'Makhana (fox nuts) roasted in ghee (snack)',
  ],
  GLUTEN_FREE: [
    'Rice poha with vegetables (breakfast) — gluten-free',
    'Grilled chicken with quinoa and salad (lunch)',
    'Dal with rice and sabzi (dinner) — naturally gluten-free',
    'Idli with sambar and coconut chutney (breakfast)',
    'Grilled fish with sweet potato (dinner)',
    'Omelette with vegetables (breakfast)',
    'Rajma with rice (lunch)',
    'Vegetable upma with semolina avoided — use millet upma (breakfast)',
    'Chickpea salad with lemon dressing (lunch)',
    'Fresh fruit with rice cakes (snack)',
  ],
  LACTOSE_FREE: [
    'Poha with peanuts and vegetables (breakfast)',
    'Grilled chicken with brown rice (lunch)',
    'Tofu stir-fry with quinoa (dinner)',
    'Almond milk smoothie with banana and oats (breakfast)',
    'Lentil soup with whole wheat bread (dinner)',
    'Boiled eggs with avocado toast (breakfast)',
    'Chickpea salad with olive oil dressing (lunch)',
    'Grilled fish with roasted vegetables (dinner)',
    'Hummus with vegetable sticks (snack)',
    'Rice pudding made with coconut milk (snack)',
  ],
}

// ── Supplement suggestions ────────────────────────────────────────────────────
const SUPPLEMENT_SUGGESTIONS: Record<Goal, string[]> = {
  FAT_LOSS: ['Whey Protein Isolate', 'L-Carnitine', 'Green Tea Extract'],
  MUSCLE_GAIN: ['Whey Protein Concentrate', 'Creatine Monohydrate', 'Multivitamin'],
  RECOMPOSITION: ['Whey Protein Isolate', 'Creatine Monohydrate', 'Omega-3 Fish Oil'],
  MAINTENANCE: ['Multivitamin', 'Omega-3 Fish Oil'],
}

// ── Main engine function ──────────────────────────────────────────────────────
export function nutritionEngine(
  member: Member,
  dietaryProfile: DietaryProfile | null,
  assessment: Assessment
): NutritionPlan {
  const { height, age, gender, goal, trainingLevel } = member
  const weight = assessment.weight  // Always use current assessment weight for BMR

  // BMR
  const bmr = calculateBMR(weight, height, age, gender)

  // TDEE
  const tdee = bmr * ACTIVITY_MULTIPLIERS[trainingLevel]

  // Calorie target
  const dailyCalories = Math.round(tdee + GOAL_ADJUSTMENTS[goal])

  // Macros
  const splits = MACRO_SPLITS[goal]
  const proteinGrams = Math.round((dailyCalories * splits.protein) / 4)
  const carbGrams = Math.round((dailyCalories * splits.carbs) / 4)
  const fatGrams = Math.round((dailyCalories * splits.fat) / 9)

  // Hydration
  const hydrationLitres = parseFloat((weight * 0.033).toFixed(1))

  // Meal suggestions
  const dietType = dietaryProfile?.dietType ?? 'NON_VEGETARIAN'
  const pool = MEAL_POOLS[dietType] ?? MEAL_POOLS.NON_VEGETARIAN
  const mealsPerDay = dietaryProfile?.mealsPerDay ?? 3

  // Pick top N meals from pool based on meals per day (cycle through pool)
  const mealSuggestions = pool.slice(0, Math.min(mealsPerDay + 2, pool.length))

  // Supplement suggestions — only if allowed
  const supplementSuggestions =
    dietaryProfile?.supplementsAllowed !== false
      ? SUPPLEMENT_SUGGESTIONS[goal]
      : []

  return {
    dailyCalories,
    proteinGrams,
    carbGrams,
    fatGrams,
    mealSuggestions,
    supplementSuggestions,
    hydrationLitres,
  }
}
