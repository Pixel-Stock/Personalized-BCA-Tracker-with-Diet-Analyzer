'use client'
// src/components/dashboard/StatsCard.tsx
import React from 'react'

interface StatsCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  description?: string
  variant?: 'blue' | 'green' | 'amber' | 'purple'
}

const variantStyles = {
  blue:   { bg: 'bg-blue-50',   icon: 'bg-blue-600',   text: 'text-blue-700' },
  green:  { bg: 'bg-green-50',  icon: 'bg-green-600',  text: 'text-green-700' },
  amber:  { bg: 'bg-amber-50',  icon: 'bg-amber-500',  text: 'text-amber-700' },
  purple: { bg: 'bg-purple-50', icon: 'bg-purple-600', text: 'text-purple-700' },
}

export function StatsCard({ title, value, icon, description, variant = 'blue' }: StatsCardProps) {
  const s = variantStyles[variant]

  return (
    <div className={`${s.bg} rounded-xl p-5 border border-white shadow-sm`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`${s.icon} w-10 h-10 rounded-lg flex items-center justify-center text-white flex-shrink-0`}>
          {icon}
        </div>
      </div>
      <div className={`text-3xl font-bold ${s.text} mb-1`}>{value}</div>
      <div className="text-sm font-medium text-gray-600">{title}</div>
      {description && <div className="text-xs text-gray-400 mt-1">{description}</div>}
    </div>
  )
}
