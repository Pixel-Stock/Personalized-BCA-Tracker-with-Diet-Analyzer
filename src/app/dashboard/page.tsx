// src/app/dashboard/page.tsx
import React from 'react'
import { prisma } from '@/lib/prisma'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'
import { StatsCard } from '@/components/dashboard/StatsCard'
import { RecentAssessments } from '@/components/dashboard/RecentAssessments'
import { DueForReassessment } from '@/components/dashboard/DueForReassessment'
import { Card } from '@/components/ui/Card'
import { DashboardChart } from './DashboardChart'
import { startOfMonth, endOfMonth, subDays } from 'date-fns'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const now = new Date()
  const thirtyDaysAgo = subDays(now, 30)

  // Parallel data fetching
  const [totalMembers, assessmentsThisMonth, allMembers, recentAssessments] = await Promise.all([
    prisma.member.count(),
    prisma.assessment.count({
      where: { date: { gte: startOfMonth(now), lte: endOfMonth(now) } },
    }),
    prisma.member.findMany({
      include: {
        dietaryProfile: true,
        assessments: {
          orderBy: { date: 'desc' },
          take: 1,
          select: { id: true, date: true, weight: true, bodyFat: true, musclePct: true },
        },
      },
    }),
    prisma.assessment.findMany({
      take: 10,
      orderBy: { date: 'desc' },
      include: { member: true },
    }),
  ])

  // Members due for reassessment (no assessment in 30+ days, or never)
  const dueMembers = allMembers.filter((m) => {
    if (m.assessments.length === 0) return true
    return new Date(m.assessments[0].date) < thirtyDaysAgo
  })

  // Member growth data for chart (last 6 months)
  const growthData = await prisma.$queryRaw<{ month: string; count: bigint }[]>`
    SELECT 
      TO_CHAR(DATE_TRUNC('month', "joinDate"), 'Mon YY') as month,
      COUNT(*) as count
    FROM "Member"
    WHERE "joinDate" >= NOW() - INTERVAL '6 months'
    GROUP BY DATE_TRUNC('month', "joinDate")
    ORDER BY DATE_TRUNC('month', "joinDate") ASC
  `

  const chartData = growthData.map((d) => ({
    month: d.month,
    members: Number(d.count),
  }))

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 lg:ml-56">
        <TopBar
          title="Dashboard"
          subtitle="Overview of your gym's performance"
        />

        <div className="p-6 space-y-6 animate-fade-in">
          {/* Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              title="Total Members"
              value={totalMembers}
              variant="blue"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              }
            />
            <StatsCard
              title="Assessments This Month"
              value={assessmentsThisMonth}
              variant="green"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              }
            />
            <StatsCard
              title="Due for Reassessment"
              value={dueMembers.length}
              variant="amber"
              description="Members > 30 days since last BCA"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <StatsCard
              title="Active Members"
              value={allMembers.filter(m => m.assessments.length > 0).length}
              variant="purple"
              description="Members with at least 1 assessment"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              }
            />
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Assessments — 2 cols */}
            <div className="lg:col-span-2">
              <Card title="Recent Assessments" padding={false}>
                <div className="px-6 py-4">
                  <RecentAssessments assessments={recentAssessments as Parameters<typeof RecentAssessments>[0]['assessments']} />
                </div>
              </Card>
            </div>

            {/* Due for Reassessment — 1 col */}
            <div>
              <Card title="Due for Reassessment">
                <DueForReassessment members={dueMembers as Parameters<typeof DueForReassessment>[0]['members']} />
              </Card>
            </div>
          </div>

          {/* Growth Chart */}
          {chartData.length > 0 && (
            <Card title="Member Growth — Last 6 Months">
              <DashboardChart data={chartData} />
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
