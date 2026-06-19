'use client'
// src/components/members/MemberForm.tsx
// Unified create/edit form for member + dietary profile

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { MemberSchema, type MemberFormData } from '@/lib/utils/validators'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { format } from 'date-fns'
import type { MemberWithRelations } from '@/types'

interface MemberFormProps {
  defaultValues?: Partial<MemberWithRelations>
  memberId?: string
  mode: 'create' | 'edit'
  nextMemberIdSuggestion?: string
}

const Toggle = ({
  label,
  checked,
  onChange,
  id,
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
  id: string
}) => (
  <label htmlFor={id} className="flex items-center justify-between cursor-pointer py-2">
    <span className="text-sm text-gray-700">{label}</span>
    <button
      type="button"
      id={id}
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative w-10 h-5 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${
        checked ? 'bg-blue-600' : 'bg-gray-200'
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  </label>
)

export function MemberForm({
  defaultValues,
  memberId,
  mode,
  nextMemberIdSuggestion,
}: MemberFormProps) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const dp = defaultValues?.dietaryProfile

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<MemberFormData>({
    resolver: zodResolver(MemberSchema),
    defaultValues: {
      memberId: defaultValues?.memberId ?? nextMemberIdSuggestion ?? '',
      name: defaultValues?.name ?? '',
      phone: defaultValues?.phone ?? '',
      email: defaultValues?.email ?? '',
      age: defaultValues?.age ?? 25,
      gender: defaultValues?.gender ?? 'MALE',
      height: defaultValues?.height ?? 170,
      goal: defaultValues?.goal ?? 'FAT_LOSS',
      trainingLevel: defaultValues?.trainingLevel ?? 'BEGINNER',
      joinDate: defaultValues?.joinDate
        ? format(new Date(defaultValues.joinDate), 'yyyy-MM-dd')
        : format(new Date(), 'yyyy-MM-dd'),
      dietaryProfile: {
        dietType: dp?.dietType ?? 'NON_VEGETARIAN',
        mealsPerDay: dp?.mealsPerDay ?? 3,
        eatsBreakfast: dp?.eatsBreakfast ?? true,
        eatsLunch: dp?.eatsLunch ?? true,
        eatsDinner: dp?.eatsDinner ?? true,
        frequentSnacking: dp?.frequentSnacking ?? false,
        lateNightEating: dp?.lateNightEating ?? false,
        supplementsAllowed: dp?.supplementsAllowed ?? true,
      },
    },
  })

  // Watch toggles
  const eatsBreakfast = watch('dietaryProfile.eatsBreakfast')
  const eatsLunch = watch('dietaryProfile.eatsLunch')
  const eatsDinner = watch('dietaryProfile.eatsDinner')
  const frequentSnacking = watch('dietaryProfile.frequentSnacking')
  const lateNightEating = watch('dietaryProfile.lateNightEating')
  const supplementsAllowed = watch('dietaryProfile.supplementsAllowed')

  const onSubmit = async (data: MemberFormData) => {
    setSubmitting(true)
    setError(null)

    try {
      const url = mode === 'create' ? '/api/members' : `/api/members/${memberId}`
      const method = mode === 'create' ? 'POST' : 'PUT'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const json = await res.json()

      if (!res.ok) {
        setError(json.error || 'Something went wrong')
        return
      }

      const id = mode === 'create' ? json.member.id : memberId
      router.push(`/members/${id}`)
      router.refresh()
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* ── Personal Information ────────────────────────────────────────── */}
      <Card title="Personal Information">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Full Name"
            required
            placeholder="e.g. Rohan Sharma"
            error={errors.name?.message}
            {...register('name')}
          />
          <Input
            label="Member ID"
            required
            placeholder={nextMemberIdSuggestion ?? 'FT0001'}
            hint="Auto-suggested, can be overridden"
            error={errors.memberId?.message}
            {...register('memberId')}
          />
          <Input
            label="Phone"
            type="tel"
            placeholder="+91 98765 43210"
            error={errors.phone?.message}
            {...register('phone')}
          />
          <Input
            label="Email"
            type="email"
            placeholder="member@example.com"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="Age"
            type="number"
            required
            min={10}
            max={100}
            error={errors.age?.message}
            {...register('age', { valueAsNumber: true })}
          />
          <Select
            label="Gender"
            required
            error={errors.gender?.message}
            options={[
              { value: 'MALE', label: 'Male' },
              { value: 'FEMALE', label: 'Female' },
              { value: 'OTHER', label: 'Other' },
            ]}
            {...register('gender')}
          />
          <Input
            label="Height (cm)"
            type="number"
            required
            min={100}
            max={250}
            error={errors.height?.message}
            {...register('height', { valueAsNumber: true })}
          />
          <Input
            label="Join Date"
            type="date"
            required
            error={errors.joinDate?.message}
            {...register('joinDate')}
          />
        </div>
      </Card>

      {/* ── Fitness Profile ─────────────────────────────────────────────── */}
      <Card title="Fitness Profile">
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Fitness Goal"
            required
            error={errors.goal?.message}
            options={[
              { value: 'FAT_LOSS', label: 'Fat Loss' },
              { value: 'MUSCLE_GAIN', label: 'Muscle Gain' },
              { value: 'RECOMPOSITION', label: 'Body Recomposition' },
              { value: 'MAINTENANCE', label: 'Maintenance' },
            ]}
            {...register('goal')}
          />
          <Select
            label="Training Level"
            required
            error={errors.trainingLevel?.message}
            options={[
              { value: 'BEGINNER', label: 'Beginner (1–2 sessions/week)' },
              { value: 'INTERMEDIATE', label: 'Intermediate (3–4 sessions/week)' },
              { value: 'ADVANCED', label: 'Advanced (5+ sessions/week)' },
            ]}
            {...register('trainingLevel')}
          />
        </div>
      </Card>

      {/* ── Dietary Profile ─────────────────────────────────────────────── */}
      <Card title="Dietary Preferences">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Select
            label="Diet Type"
            error={errors.dietaryProfile?.dietType?.message}
            options={[
              { value: 'NON_VEGETARIAN', label: 'Non-Vegetarian' },
              { value: 'VEGETARIAN', label: 'Vegetarian' },
              { value: 'VEGAN', label: 'Vegan' },
              { value: 'EGGETARIAN', label: 'Eggetarian' },
              { value: 'PESCATARIAN', label: 'Pescatarian' },
              { value: 'JAIN', label: 'Jain' },
              { value: 'GLUTEN_FREE', label: 'Gluten-Free' },
              { value: 'LACTOSE_FREE', label: 'Lactose-Free' },
            ]}
            {...register('dietaryProfile.dietType')}
          />
          <Select
            label="Meals Per Day"
            error={errors.dietaryProfile?.mealsPerDay?.message}
            options={[1, 2, 3, 4, 5, 6].map((n) => ({
              value: String(n),
              label: `${n} meal${n > 1 ? 's' : ''}`,
            }))}
            {...register('dietaryProfile.mealsPerDay', { valueAsNumber: true })}
          />
        </div>

        <div className="border-t border-gray-100 pt-4 space-y-0 divide-y divide-gray-100">
          <Toggle
            id="toggle-breakfast"
            label="Eats Breakfast"
            checked={eatsBreakfast}
            onChange={(v) => setValue('dietaryProfile.eatsBreakfast', v)}
          />
          <Toggle
            id="toggle-lunch"
            label="Eats Lunch"
            checked={eatsLunch}
            onChange={(v) => setValue('dietaryProfile.eatsLunch', v)}
          />
          <Toggle
            id="toggle-dinner"
            label="Eats Dinner"
            checked={eatsDinner}
            onChange={(v) => setValue('dietaryProfile.eatsDinner', v)}
          />
          <Toggle
            id="toggle-snacking"
            label="Frequent Snacking"
            checked={frequentSnacking}
            onChange={(v) => setValue('dietaryProfile.frequentSnacking', v)}
          />
          <Toggle
            id="toggle-latenight"
            label="Late Night Eating"
            checked={lateNightEating}
            onChange={(v) => setValue('dietaryProfile.lateNightEating', v)}
          />
          <Toggle
            id="toggle-supplements"
            label="Open to Supplements"
            checked={supplementsAllowed}
            onChange={(v) => setValue('dietaryProfile.supplementsAllowed', v)}
          />
        </div>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button type="submit" loading={submitting} size="lg">
          {mode === 'create' ? 'Create Member' : 'Save Changes'}
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
  )
}
