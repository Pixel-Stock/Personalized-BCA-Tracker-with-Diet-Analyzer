'use client'
// src/app/members/[id]/assessment/new/page.tsx
import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AssessmentSchema, type AssessmentFormData } from '@/lib/utils/validators'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { format } from 'date-fns'
import type { Assessment, MemberWithRelations } from '@/types'

export default function NewAssessmentPage() {
  const params = useParams()
  const router = useRouter()
  const memberId = params.id as string

  const [member, setMember] = useState<MemberWithRelations | null>(null)
  const [previousAssessment, setPreviousAssessment] = useState<Assessment | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string>()

  useEffect(() => {
    import('@/lib/supabase').then(({ createClient }) => {
      const supabase = createClient()
      supabase.auth.getUser().then(({ data: { user } }) => setUserEmail(user?.email))
    })

    fetch(`/api/members/${memberId}`)
      .then((r) => r.json())
      .then((d) => {
        setMember(d.member)
        if (d.member?.assessments?.length > 0) {
          setPreviousAssessment(d.member.assessments[0])
        }
      })
  }, [memberId])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AssessmentFormData>({
    resolver: zodResolver(AssessmentSchema),
    defaultValues: {
      memberId,
      date: format(new Date(), 'yyyy-MM-dd'),
    },
  })

  const onSubmit = async (data: AssessmentFormData) => {
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/assessments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error || 'Failed to save assessment')
        return
      }
      router.push(`/members/${memberId}`)
      router.refresh()
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar userEmail={userEmail} />
      <main className="flex-1 lg:ml-56">
        <TopBar
          title={member ? `New Assessment — ${member.name}` : 'New Assessment'}
          subtitle="Enter body composition values from the BCA machine"
        />
        <div className="p-6 animate-fade-in">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Date */}
                <Card title="Assessment Date">
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Assessment Date"
                      type="date"
                      required
                      {...register('date')}
                      error={errors.date?.message}
                    />
                  </div>
                </Card>

                {/* Required BCA Values */}
                <Card title="Body Composition (Required)">
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Weight (kg)"
                      type="number"
                      step="0.1"
                      required
                      placeholder="e.g. 72.5"
                      error={errors.weight?.message}
                      {...register('weight', { valueAsNumber: true })}
                    />
                    <Input
                      label="BMI"
                      type="number"
                      step="0.1"
                      required
                      placeholder="e.g. 23.4"
                      error={errors.bmi?.message}
                      {...register('bmi', { valueAsNumber: true })}
                    />
                    <Input
                      label="Body Fat %"
                      type="number"
                      step="0.1"
                      required
                      placeholder="e.g. 22.5"
                      error={errors.bodyFat?.message}
                      {...register('bodyFat', { valueAsNumber: true })}
                    />
                    <Input
                      label="Muscle %"
                      type="number"
                      step="0.1"
                      required
                      placeholder="e.g. 38.2"
                      error={errors.musclePct?.message}
                      {...register('musclePct', { valueAsNumber: true })}
                    />
                    <Input
                      label="Visceral Fat (level 1–59)"
                      type="number"
                      step="1"
                      min={1}
                      max={59}
                      required
                      placeholder="e.g. 8"
                      error={errors.visceralFat?.message}
                      {...register('visceralFat', { valueAsNumber: true })}
                    />
                    <Input
                      label="Subcutaneous Fat % (optional)"
                      type="number"
                      step="0.1"
                      placeholder="e.g. 18.2"
                      error={errors.subcutaneousFat?.message}
                      {...register('subcutaneousFat', { valueAsNumber: true, setValueAs: v => v === '' ? null : parseFloat(v) })}
                    />
                  </div>
                </Card>

                {/* Optional BCA Values */}
                <Card title="Additional Metrics (Optional)">
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="BMR (kcal/day)"
                      type="number"
                      step="1"
                      placeholder="e.g. 1650"
                      hint="Basal Metabolic Rate from machine"
                      {...register('bmr', { valueAsNumber: true, setValueAs: v => v === '' ? null : parseFloat(v) })}
                    />
                    <Input
                      label="Metabolic Age (years)"
                      type="number"
                      step="1"
                      placeholder="e.g. 28"
                      {...register('metabolicAge', { valueAsNumber: true, setValueAs: v => v === '' ? null : parseInt(v) })}
                    />
                    <Input
                      label="Body Water %"
                      type="number"
                      step="0.1"
                      placeholder="e.g. 58.5"
                      {...register('bodyWater', { valueAsNumber: true, setValueAs: v => v === '' ? null : parseFloat(v) })}
                    />
                    <Input
                      label="Protein %"
                      type="number"
                      step="0.1"
                      placeholder="e.g. 17.8"
                      {...register('proteinPct', { valueAsNumber: true, setValueAs: v => v === '' ? null : parseFloat(v) })}
                    />
                    <Input
                      label="Bone Mass (kg)"
                      type="number"
                      step="0.1"
                      placeholder="e.g. 3.2"
                      {...register('boneMass', { valueAsNumber: true, setValueAs: v => v === '' ? null : parseFloat(v) })}
                    />
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Trainer Notes (optional)
                    </label>
                    <textarea
                      placeholder="Any observations, feedback, or notes for this assessment…"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      {...register('notes')}
                    />
                  </div>
                </Card>

                <div className="flex gap-3">
                  <Button type="submit" loading={submitting} size="lg">
                    Save Assessment
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="lg"
                    onClick={() => router.back()}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>

            {/* Previous Assessment Reference Panel */}
            <div>
              <Card title="Previous Assessment Reference">
                {previousAssessment ? (
                  <div className="space-y-3 text-sm">
                    <div className="text-xs text-gray-500 mb-3">
                      {format(new Date(previousAssessment.date), 'dd MMMM yyyy')}
                    </div>
                    {[
                      { label: 'Weight', value: `${previousAssessment.weight} kg` },
                      { label: 'BMI', value: previousAssessment.bmi.toFixed(1) },
                      { label: 'Body Fat', value: `${previousAssessment.bodyFat.toFixed(1)}%` },
                      { label: 'Muscle %', value: `${previousAssessment.musclePct.toFixed(1)}%` },
                      { label: 'Visceral Fat', value: `${previousAssessment.visceralFat}` },
                      ...(previousAssessment.bodyWater != null ? [{ label: 'Body Water', value: `${previousAssessment.bodyWater.toFixed(1)}%` }] : []),
                      ...(previousAssessment.metabolicAge != null ? [{ label: 'Metabolic Age', value: `${previousAssessment.metabolicAge} yrs` }] : []),
                    ].map((row) => (
                      <div key={row.label} className="flex justify-between py-2 border-b border-gray-50">
                        <span className="text-gray-500">{row.label}</span>
                        <span className="font-semibold text-gray-800">{row.value}</span>
                      </div>
                    ))}
                    <p className="text-xs text-gray-400 mt-2 italic">
                      Use these as reference when entering the new values above.
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-400">
                    <svg className="w-8 h-8 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-sm font-medium">No previous assessment</p>
                    <p className="text-xs mt-1">This will be the baseline record</p>
                  </div>
                )}
              </Card>

              {member && (
                <Card title="Member Info" className="mt-4">
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Height</span>
                      <span className="font-medium">{member.height} cm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Age</span>
                      <span className="font-medium">{member.age} yrs</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Goal</span>
                      <span className="font-medium">{member.goal.replace('_', ' ')}</span>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
