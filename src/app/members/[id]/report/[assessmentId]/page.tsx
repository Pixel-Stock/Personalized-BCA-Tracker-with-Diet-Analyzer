// src/app/members/[id]/report/[assessmentId]/page.tsx
import React from 'react'
import { createServerClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
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

export const dynamic = 'force-dynamic'

export default async function ReportPreviewPage({
  params,
}: {
  params: Promise<{ id: string; assessmentId: string }>
}) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

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

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
    `Hi! Here is your BCA Report from ${gymSettings?.gymName ?? 'FitnessTouch'}. Download your PDF here: ${process.env.NEXT_PUBLIC_APP_URL}/api/report/${assessmentId}`
  )}`

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
      <Sidebar userEmail={user.email} />
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
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.555 4.104 1.523 5.828L0 24l6.352-1.499C8.047 23.447 9.987 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.892 0-3.665-.516-5.181-1.411l-.371-.22-3.827.903.965-3.719-.241-.388C2.527 15.68 2 13.905 2 12 2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                  </svg>
                  Share via WhatsApp
                </a>
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
