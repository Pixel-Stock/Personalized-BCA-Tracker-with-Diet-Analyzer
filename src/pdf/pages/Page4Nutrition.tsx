// src/pdf/pages/Page4Nutrition.tsx
import React from 'react'
import { Page, View, Text } from '@react-pdf/renderer'
import { pdfStyles } from '../styles/pdfStyles'
import { SectionHeader } from '../components/SectionHeader'
import { formatGoal } from '@/lib/utils/formatters'
import type { ReportData } from '@/types'

const GOAL_DEFICIT_NOTES: Record<string, string> = {
  FAT_LOSS: 'Based on your Fat Loss goal, a caloric deficit of 400 kcal has been applied to your TDEE.',
  MUSCLE_GAIN: 'Based on your Muscle Gain goal, a caloric surplus of 300 kcal has been applied to your TDEE.',
  RECOMPOSITION: 'Based on your Body Recomposition goal, a mild deficit of 100 kcal has been applied to support fat loss while preserving muscle.',
  MAINTENANCE: 'Based on your Maintenance goal, your calorie target matches your total daily energy expenditure (TDEE).',
}

interface Page4NutritionProps {
  data: ReportData
}

export function Page4Nutrition({ data }: Page4NutritionProps) {
  const { nutrition, member, gymSettings } = data
  const { dailyCalories, proteinGrams, carbGrams, fatGrams, mealSuggestions, supplementSuggestions, hydrationLitres } = nutrition

  const totalMacroGrams = proteinGrams + carbGrams + fatGrams
  const proteinPct = Math.round((proteinGrams * 4 / dailyCalories) * 100)
  const carbPct = Math.round((carbGrams * 4 / dailyCalories) * 100)
  const fatPct = Math.round((fatGrams * 9 / dailyCalories) * 100)

  return (
    <Page size="A4" style={pdfStyles.page}>
      <SectionHeader
        title={`Nutrition Plan — ${formatGoal(member.goal)}`}
        backgroundColor={gymSettings.primaryColor}
      />

      {/* Daily Calorie Display */}
      <View style={pdfStyles.calorieDisplay}>
        <Text style={pdfStyles.calorieNumber}>{dailyCalories.toLocaleString()}</Text>
        <Text style={pdfStyles.calorieLabel}>Daily Calorie Target (kcal)</Text>
      </View>

      {/* Macro Table */}
      <SectionHeader title="Macro Breakdown" backgroundColor={gymSettings.primaryColor} />
      <View style={pdfStyles.table}>
        <View style={pdfStyles.tableHeader}>
          <Text style={[pdfStyles.tableHeaderCell, { flex: 2 }]}>Macronutrient</Text>
          <Text style={[pdfStyles.tableHeaderCell, { flex: 2, textAlign: 'center' }]}>Grams / Day</Text>
          <Text style={[pdfStyles.tableHeaderCell, { flex: 2, textAlign: 'center' }]}>Calories</Text>
          <Text style={[pdfStyles.tableHeaderCell, { flex: 1, textAlign: 'right' }]}>% Split</Text>
        </View>
        <View style={pdfStyles.tableRow}>
          <Text style={[pdfStyles.tableCell, { flex: 2 }]}>🥩 Protein</Text>
          <Text style={[pdfStyles.macroGrams, { flex: 2 }]}>{proteinGrams}g</Text>
          <Text style={[pdfStyles.tableCell, { flex: 2, textAlign: 'center' }]}>{proteinGrams * 4} kcal</Text>
          <Text style={[pdfStyles.macroPct, { flex: 1 }]}>{proteinPct}%</Text>
        </View>
        <View style={pdfStyles.tableRowAlt}>
          <Text style={[pdfStyles.tableCell, { flex: 2 }]}>🌾 Carbohydrates</Text>
          <Text style={[pdfStyles.macroGrams, { flex: 2 }]}>{carbGrams}g</Text>
          <Text style={[pdfStyles.tableCell, { flex: 2, textAlign: 'center' }]}>{carbGrams * 4} kcal</Text>
          <Text style={[pdfStyles.macroPct, { flex: 1 }]}>{carbPct}%</Text>
        </View>
        <View style={pdfStyles.tableRow}>
          <Text style={[pdfStyles.tableCell, { flex: 2 }]}>🥑 Healthy Fats</Text>
          <Text style={[pdfStyles.macroGrams, { flex: 2 }]}>{fatGrams}g</Text>
          <Text style={[pdfStyles.tableCell, { flex: 2, textAlign: 'center' }]}>{fatGrams * 9} kcal</Text>
          <Text style={[pdfStyles.macroPct, { flex: 1 }]}>{fatPct}%</Text>
        </View>
      </View>

      {/* Hydration */}
      <View style={pdfStyles.hydrationBox}>
        <Text style={pdfStyles.hydrationText}>💧 Hydration Target: {hydrationLitres} litres of water daily</Text>
      </View>

      {/* Goal Note */}
      <Text style={pdfStyles.goalNote}>{GOAL_DEFICIT_NOTES[member.goal]}</Text>

      {/* Meal Suggestions */}
      <View style={pdfStyles.mb12} />
      <SectionHeader title="Meal Suggestions" backgroundColor={gymSettings.primaryColor} />
      {mealSuggestions.map((meal, i) => (
        <View key={i} style={pdfStyles.bulletItem}>
          <Text style={pdfStyles.bulletDot}>•</Text>
          <Text style={pdfStyles.bulletText}>{meal}</Text>
        </View>
      ))}

      {/* Supplement Suggestions */}
      {supplementSuggestions.length > 0 && (
        <>
          <View style={pdfStyles.mb12} />
          <SectionHeader title="Supplement Suggestions" backgroundColor={gymSettings.primaryColor} />
          {supplementSuggestions.map((supp, i) => (
            <View key={i} style={pdfStyles.bulletItem}>
              <Text style={pdfStyles.bulletDot}>✓</Text>
              <Text style={pdfStyles.bulletText}>{supp}</Text>
            </View>
          ))}
          <Text style={pdfStyles.supplementDisclaimer}>
            * Consult a healthcare professional or registered dietitian before starting any supplement regimen. These are general suggestions only.
          </Text>
        </>
      )}

      {/* Footer */}
      <View style={pdfStyles.footer}>
        <Text style={pdfStyles.footerText}>{member.name} — {member.memberId}</Text>
        <Text style={pdfStyles.footerBrand}>{gymSettings.gymName}</Text>
      </View>
    </Page>
  )
}
