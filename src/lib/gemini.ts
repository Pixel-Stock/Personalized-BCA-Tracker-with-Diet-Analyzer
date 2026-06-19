// src/lib/gemini.ts
// Gemini AI wrapper for generating personalized BCA report recommendations

import { GoogleGenerativeAI } from '@google/generative-ai'
import type { Assessment, Member, NutritionPlan } from '@/types'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function generateAiRecommendations(
  member: Member,
  assessment: Assessment,
  nutrition: NutritionPlan
): Promise<string[]> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = `You are a professional fitness trainer writing a body composition assessment report.

Member Profile:
- Name: ${member.name}
- Age: ${member.age} years
- Gender: ${member.gender}
- Height: ${member.height} cm
- Goal: ${member.goal} (FAT_LOSS=lose fat, MUSCLE_GAIN=build muscle, RECOMPOSITION=lose fat+gain muscle, MAINTENANCE=maintain)
- Training Level: ${member.trainingLevel}

Current Body Composition Results:
- Weight: ${assessment.weight} kg
- BMI: ${assessment.bmi}
- Body Fat: ${assessment.bodyFat}%
- Muscle %: ${assessment.musclePct}%
- Visceral Fat: ${assessment.visceralFat} (scale 1–59, healthy is below 12)
${assessment.subcutaneousFat != null ? `- Subcutaneous Fat: ${assessment.subcutaneousFat}%` : ''}
${assessment.bmr != null ? `- BMR: ${assessment.bmr} kcal/day` : ''}
${assessment.metabolicAge != null ? `- Metabolic Age: ${assessment.metabolicAge} years` : ''}

Prescribed Daily Nutrition:
- Calories: ${nutrition.dailyCalories} kcal
- Protein: ${nutrition.proteinGrams}g
- Carbs: ${nutrition.carbGrams}g
- Fat: ${nutrition.fatGrams}g
- Water: ${nutrition.hydrationLitres}L

Write exactly 3 personalized, actionable fitness recommendations for this member based on their data. 
Each recommendation must:
- Be specific to their actual numbers (reference the metrics)
- Be actionable and practical (something they can do this week)
- Be 1–2 sentences maximum
- Be encouraging but honest

Return ONLY a JSON array of 3 strings. No other text, no markdown, no explanation.
Example format: ["Recommendation 1.", "Recommendation 2.", "Recommendation 3."]`

    const result = await model.generateContent(prompt)
    const text = result.response.text().trim()

    // Parse the JSON array from Gemini response
    const parsed = JSON.parse(text)
    if (Array.isArray(parsed) && parsed.length >= 3) {
      return parsed.slice(0, 3).map(String)
    }
    return fallbackRecommendations(member, assessment)
  } catch (error) {
    console.error('Gemini API error — using fallback recommendations:', error)
    return fallbackRecommendations(member, assessment)
  }
}

// Fallback if Gemini API fails — rule-based recommendations
function fallbackRecommendations(member: Member, assessment: Assessment): string[] {
  const recs: string[] = []

  if (assessment.visceralFat > 12) {
    recs.push(`Your visceral fat level of ${assessment.visceralFat} is elevated. Prioritize 30 minutes of cardio 4× per week — this type of fat responds strongly to aerobic exercise.`)
  }
  if (assessment.bodyFat > (member.gender === 'MALE' ? 20 : 28)) {
    recs.push(`Maintain a modest caloric deficit of 300–400 kcal/day from your prescribed target. Consistent tracking for 4 weeks will produce measurable fat loss results.`)
  }
  if (assessment.musclePct < (member.gender === 'MALE' ? 35 : 28)) {
    recs.push(`Increase resistance training to 3+ sessions per week focusing on compound movements like squats, deadlifts, and bench press to stimulate muscle growth.`)
  }
  if (recs.length === 0) {
    recs.push(
      'Your metrics are within healthy ranges — maintain your current training and nutrition consistency.',
      'Apply progressive overload by increasing weights or reps every 2–3 weeks to continue building progress.',
      `Stay aligned with your ${member.goal.replace('_', ' ').toLowerCase()} goal by tracking your daily nutrition intake.`
    )
  }
  return recs.slice(0, 3)
}
