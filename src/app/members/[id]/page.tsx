// src/app/members/[id]/page.tsx
import React from 'react'
import { createServerClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { AssessmentHistory } from '@/components/members/AssessmentHistory'
import { formatDate, formatGoal, formatTrainingLevel, formatGender, formatDietType } from '@/lib/utils/formatters'
import { differenceInDays } from 'date-fns'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function MemberProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { id } = await params

  const member = await prisma.member.findUnique({
    where: { id },
    include: {
      dietaryProfile: true,
      assessments: { orderBy: { date: 'desc' } },
    },
  })

  if (!member) notFound()

  const lastAssessment = member.assessments[0]
  const daysSince = lastAssessment
    ? differenceInDays(new Date(), new Date(lastAssessment.date))
    : null

  const goalVariant = {
    FAT_LOSS: 'warning',
    MUSCLE_GAIN: 'info',
    RECOMPOSITION: 'success',
    MAINTENANCE: 'neutral',
  } as const

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar userEmail={user.email} />
      <main className="flex-1 lg:ml-56">
        <TopBar
          title={member.name}
          subtitle={`Member ID: ${member.memberId}`}
          actions={
            <div className="flex gap-2">
              <Link href={`/members/${id}/edit`}>
                <Button variant="outline" size="sm">Edit Profile</Button>
              </Link>
              <Link href={`/members/${id}/assessment/new`}>
                <Button size="sm" id="new-assessment-btn">+ New Assessment</Button>
              </Link>
            </div>
          }
        />

        <div className="p-6 space-y-6 animate-fade-in">
          {/* Profile Header */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-start gap-5">
              {/* Avatar */}
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 shadow-lg">
                {member.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-xl font-bold text-gray-900">{member.name}</h2>
                  <Badge variant={goalVariant[member.goal] as 'warning' | 'info' | 'success' | 'neutral'}>
                    {formatGoal(member.goal)}
                  </Badge>
                  <Badge variant="info">{formatTrainingLevel(member.trainingLevel)}</Badge>
                  {daysSince !== null && daysSince > 30 && (
                    <Badge variant="warning">Due for Reassessment</Badge>
                  )}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-3">
                  <div>
                    <span className="text-xs text-gray-500 block">Age / Gender</span>
                    <span className="text-sm font-medium">{member.age} yrs • {formatGender(member.gender)}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block">Height</span>
                    <span className="text-sm font-medium">{member.height} cm</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block">Member Since</span>
                    <span className="text-sm font-medium">{formatDate(member.joinDate)}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block">Total Assessments</span>
                    <span className="text-sm font-medium">{member.assessments.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Assessment History — 2 cols */}
            <div className="lg:col-span-2">
              <Card title="Assessment History">
                <AssessmentHistory
                  assessments={member.assessments}
                  memberId={id}
                />
              </Card>
            </div>

            {/* Sidebar info */}
            <div className="space-y-4">
              {/* Contact */}
              <Card title="Contact">
                <div className="space-y-2 text-sm">
                  {member.phone && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {member.phone}
                    </div>
                  )}
                  {member.email && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {member.email}
                    </div>
                  )}
                  {!member.phone && !member.email && (
                    <p className="text-gray-400 text-xs">No contact info</p>
                  )}
                </div>
              </Card>

              {/* Dietary Profile */}
              {member.dietaryProfile && (
                <Card title="Dietary Profile">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Diet Type</span>
                      <span className="font-medium">{formatDietType(member.dietaryProfile.dietType)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Meals/Day</span>
                      <span className="font-medium">{member.dietaryProfile.mealsPerDay}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Supplements</span>
                      <span className={member.dietaryProfile.supplementsAllowed ? 'text-green-600 font-medium' : 'text-red-500 font-medium'}>
                        {member.dietaryProfile.supplementsAllowed ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Late Night Eating</span>
                      <span className={member.dietaryProfile.lateNightEating ? 'text-amber-600 font-medium' : 'text-green-600 font-medium'}>
                        {member.dietaryProfile.lateNightEating ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                </Card>
              )}

              {/* Latest metrics */}
              {lastAssessment && (
                <Card title="Latest Metrics">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Weight</span>
                      <span className="font-bold text-gray-800">{lastAssessment.weight} kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">BMI</span>
                      <span className="font-medium">{lastAssessment.bmi.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Body Fat</span>
                      <span className="font-medium">{lastAssessment.bodyFat.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Muscle</span>
                      <span className="font-medium">{lastAssessment.musclePct.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Visceral Fat</span>
                      <span className="font-medium">{lastAssessment.visceralFat}</span>
                    </div>
                    <div className="pt-2 border-t border-gray-100">
                      <Link href={`/members/${id}/report/${lastAssessment.id}`}>
                        <Button variant="outline" size="sm" className="w-full">
                          View Latest Report
                        </Button>
                      </Link>
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
