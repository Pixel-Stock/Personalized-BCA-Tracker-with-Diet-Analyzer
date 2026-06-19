'use client'
// src/components/dashboard/DueForReassessment.tsx
import React from 'react'
import Link from 'next/link'
import { differenceInDays } from 'date-fns'
import { formatDate } from '@/lib/utils/formatters'
import type { MemberListItem } from '@/types'
import { Badge } from '@/components/ui/Badge'

interface DueForReassessmentProps {
  members: MemberListItem[]
}

export function DueForReassessment({ members }: DueForReassessmentProps) {
  if (members.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400 text-sm">
        All members are up to date ✓
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {members.map((member) => {
        const lastAssessment = member.assessments[0]
        const daysSince = lastAssessment
          ? differenceInDays(new Date(), new Date(lastAssessment.date))
          : null

        return (
          <div
            key={member.id}
            className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
          >
            <div>
              <Link
                href={`/members/${member.id}`}
                className="text-sm font-medium text-gray-800 hover:text-blue-600"
              >
                {member.name}
              </Link>
              <div className="text-xs text-gray-400 mt-0.5">
                {lastAssessment
                  ? `Last: ${formatDate(lastAssessment.date)}`
                  : 'No assessments recorded'}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="warning">
                {daysSince !== null ? `${daysSince}d overdue` : 'No record'}
              </Badge>
              <Link
                href={`/members/${member.id}/assessment/new`}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium whitespace-nowrap"
              >
                + Assess
              </Link>
            </div>
          </div>
        )
      })}
    </div>
  )
}
