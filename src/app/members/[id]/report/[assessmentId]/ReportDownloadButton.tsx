'use client'
// src/app/members/[id]/report/[assessmentId]/ReportDownloadButton.tsx
import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'

interface ReportDownloadButtonProps {
  assessmentId: string
  memberName: string
}

export function ReportDownloadButton({ assessmentId, memberName }: ReportDownloadButtonProps) {
  const [downloading, setDownloading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDownload = async () => {
    setDownloading(true)
    setError(null)
    try {
      const res = await fetch(`/api/report/${assessmentId}`)
      if (!res.ok) {
        const json = await res.json()
        setError(json.error || 'PDF generation failed')
        return
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `FitnessTouch_${memberName.replace(/\s+/g, '_')}_Report.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch {
      setError('Failed to download PDF')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div>
      <Button
        onClick={handleDownload}
        loading={downloading}
        id="download-pdf-btn"
        className="flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        {downloading ? 'Generating PDF…' : 'Download PDF'}
      </Button>
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  )
}
