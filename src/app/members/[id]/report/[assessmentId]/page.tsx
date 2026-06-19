// src/app/members/[id]/report/[assessmentId]/page.tsx
import React from 'react'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { comparisonEngine } from '@/lib/engines/comparisonEngine'
import { nutritionEngine } from '@/lib/engines/nutritionEngine'
import { formatDate, formatGoal } from '@/lib/utils/formatters'
import Link from 'next/link'
import { ReportDownloadButton } from './ReportDownloadButton'
import { WhatsAppShareButton } from './WhatsAppShareButton'

export const dynamic = 'force-dynamic'

export default async function ReportPreviewPage({
  params,
}: {
  params: Promise<{ id: string; assessmentId: string }>
}) {
  const { id: memberId, assessmentId } = await params

  const [member, currentAssessment] = await Promise.all([
    prisma.member.findUnique({
      where: { id: memberId },
      include: { dietaryProfile: true, assessments: { orderBy: { date: 'desc' } } },
    }),
    prisma.assessment.findUnique({ where: { id: assessmentId } }),
  ])

  if (!member || !currentAssessment) notFound()

  const previousAssessment = await prisma.assessment.findFirst({
    where: { memberId, date: { lt: currentAssessment.date } },
    orderBy: { date: 'desc' },
  })

  const comparison = comparisonEngine(currentAssessment, previousAssessment)
  const nutrition = nutritionEngine(member, member.dietaryProfile, currentAssessment)

  const gymSettings = await prisma.gymSettings.findFirst()

  const statusConfig = {
    EXCELLENT: { variant: 'success' as const, label: '🏆 Excellent Progress' },
    GOOD:      { variant: 'success' as const, label: '✓ Good Progress' },
    MODERATE:  { variant: 'warning' as const, label: '~ Moderate Progress' },
    ATTENTION: { variant: 'danger' as const, label: '⚠ Needs Attention' },
    BASELINE:  { variant: 'info' as const, label: '📋 Baseline Assessment' },
  }

  const sc = statusConfig[comparison.overallStatus]

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 lg:ml-56">
        <TopBar
          title="Report Preview"
          subtitle={`${member.name} — ${formatDate(currentAssessment.date)}`}
          actions={
            <Link href={`/members/${memberId}`}>
              <button className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
                ← Back to Profile
              </button>
            </Link>
          }
        />

        <div className="p-6 space-y-6 animate-fade-in">
          {/* Download CTA */}
          <Card>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 mb-1">Download Full PDF Report</h3>
                <p className="text-sm text-gray-500">
                  5-page professional report with health metrics, progress comparison, nutrition plan, and action items.
                </p>
              </div>
              <div className="flex gap-3 flex-shrink-0">
                <ReportDownloadButton assessmentId={assessmentId} memberName={member.name} />
                <WhatsAppShareButton
                  assessmentId={assessmentId}
                  memberName={member.name}
                  height={member.height}
                  weight={currentAssessment.weight}
                  musclePct={currentAssessment.musclePct}
                  bodyFat={currentAssessment.bodyFat}
                  visceralFat={currentAssessment.visceralFat}
                  subcutaneousFat={currentAssessment.subcutaneousFat}
                  bmr={currentAssessment.bmr}
                  bmi={currentAssessment.bmi}
                />
              </div>
            </div>
          </Card>

          {/* Overall Status */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">Overall Status:</span>
            <Badge variant={sc.variant}>{sc.label}</Badge>
            {comparison.hasComparison && comparison.daysBetweenAssessments && (
              <span className="text-xs text-gray-400">
                ({comparison.daysBetweenAssessments} days since last assessment)
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Current Metrics */}
            <Card title="Current Metrics">
              <div className="space-y-3 text-sm">
                {[
                  { label: 'Weight', value: `${currentAssessment.weight} kg`, delta: comparison.deltas.weight, improvementWhenDecrease: true },
                  { label: 'BMI', value: currentAssessment.bmi.toFixed(1), delta: comparison.deltas.bmi, improvementWhenDecrease: true },
                  { label: 'Body Fat', value: `${currentAssessment.bodyFat.toFixed(1)}%`, delta: comparison.deltas.bodyFat, improvementWhenDecrease: true },
                  { label: 'Muscle %', value: `${currentAssessment.musclePct.toFixed(1)}%`, delta: comparison.deltas.musclePct, improvementWhenDecrease: false },
                  { label: 'Visceral Fat', value: `${currentAssessment.visceralFat}`, delta: comparison.deltas.visceralFat, improvementWhenDecrease: true },
                ].map((row) => {
                  const d = row.delta
                  const isGood = d !== null && (row.improvementWhenDecrease ? d < 0 : d > 0)
                  const isBad = d !== null && (row.improvementWhenDecrease ? d > 0 : d < 0)
                  return (
                    <div key={row.label} className="flex justify-between items-center py-2 border-b border-gray-50">
                      <span className="text-gray-500">{row.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-800">{row.value}</span>
                        {d !== null && (
                          <span className={`text-xs font-medium ${isGood ? 'text-green-600' : isBad ? 'text-red-500' : 'text-gray-400'}`}>
                            {d > 0 ? `+${d.toFixed(1)}` : d.toFixed(1)}
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>

            {/* Nutrition Summary */}
            <Card title="Nutrition Plan Summary">
              <div className="space-y-3 text-sm">
                <div className="text-center py-3 bg-blue-50 rounded-lg mb-4">
                  <div className="text-2xl font-bold text-blue-600">{nutrition.dailyCalories.toLocaleString()}</div>
                  <div className="text-xs text-blue-500">kcal / day</div>
                </div>
                {[
                  { label: 'Protein', value: `${nutrition.proteinGrams}g/day` },
                  { label: 'Carbs', value: `${nutrition.carbGrams}g/day` },
                  { label: 'Fat', value: `${nutrition.fatGrams}g/day` },
                  { label: 'Water', value: `${nutrition.hydrationLitres}L/day` },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between">
                    <span className="text-gray-500">{row.label}</span>
                    <span className="font-medium">{row.value}</span>
                  </div>
                ))}
                <div className="pt-2 border-t border-gray-100">
                  <span className="text-xs text-gray-400">Goal: {formatGoal(member.goal)}</span>
                </div>
              </div>
            </Card>

            {/* Interpretation */}
            <Card title="Key Insights">
              {comparison.hasComparison && comparison.interpretations.length > 0 ? (
                <ul className="space-y-2">
                  {comparison.interpretations.map((text, i) => (
                    <li key={i} className="flex gap-2 text-sm text-gray-600">
                      <span className="text-blue-500 mt-0.5">•</span>
                      <span>{text}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-sm text-blue-600 bg-blue-50 rounded-lg p-3">
                  <strong>Baseline Assessment</strong>
                  <p className="text-xs text-blue-500 mt-1">
                    This is the first recorded assessment. Future reports will show progress comparisons.
                  </p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
