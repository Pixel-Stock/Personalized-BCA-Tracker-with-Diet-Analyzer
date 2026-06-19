'use client'
// src/components/dashboard/RecentAssessments.tsx
import React from 'react'
import Link from 'next/link'
import { formatDate } from '@/lib/utils/formatters'
import type { AssessmentWithMember } from '@/types'

interface RecentAssessmentsProps {
  assessments: AssessmentWithMember[]
}

export function RecentAssessments({ assessments }: RecentAssessmentsProps) {
  if (assessments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400 text-sm">
        No assessments yet
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-left py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Member</th>
            <th className="text-left py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
            <th className="text-left py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Weight</th>
            <th className="text-left py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Body Fat</th>
            <th className="text-left py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Muscle</th>
            <th className="text-right py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Report</th>
          </tr>
        </thead>
        <tbody>
          {assessments.map((a) => (
            <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
              <td className="py-3">
                <Link
                  href={`/members/${a.memberId}`}
                  className="font-medium text-gray-800 hover:text-blue-600"
                >
                  {a.member.name}
                </Link>
                <div className="text-xs text-gray-400">{a.member.memberId}</div>
              </td>
              <td className="py-3 text-gray-600">{formatDate(a.date)}</td>
              <td className="py-3 font-medium text-gray-800">{a.weight}kg</td>
              <td className="py-3 text-gray-600">{a.bodyFat.toFixed(1)}%</td>
              <td className="py-3 text-gray-600">{a.musclePct.toFixed(1)}%</td>
              <td className="py-3 text-right">
                <Link
                  href={`/members/${a.memberId}/report/${a.id}`}
                  className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                >
                  View →
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
