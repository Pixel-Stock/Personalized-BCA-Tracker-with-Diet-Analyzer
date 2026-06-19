'use client'
// src/app/members/[id]/report/[assessmentId]/WhatsAppShareButton.tsx
// Downloads the PDF to the trainer's device and simultaneously opens WhatsApp
// with a pre-filled metrics caption (WhatsApp API cannot attach files programmatically)

import React, { useState } from 'react'

interface WhatsAppShareButtonProps {
  assessmentId: string
  memberName: string
  height: number
  weight: number
  musclePct: number
  bodyFat: number
  visceralFat: number
  subcutaneousFat: number | null
  bmr: number | null
  bmi: number
}

export function WhatsAppShareButton({
  assessmentId,
  memberName,
  height,
  weight,
  musclePct,
  bodyFat,
  visceralFat,
  subcutaneousFat,
  bmr,
  bmi,
}: WhatsAppShareButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleShare = async () => {
    setLoading(true)
    setError(null)

    try {
      // 1. Download the PDF to trainer's device
      const res = await fetch(`/api/report/${assessmentId}`)
      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        setError(json.error || 'PDF generation failed')
        setLoading(false)
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

      // 2. Build the metrics caption in the exact format requested
      const caption = [
        `${height} cm : Height`,
        `${weight} kg : Weight`,
        `${musclePct.toFixed(1)}% : Muscle %`,
        `${bodyFat.toFixed(1)}% : Total Fat %`,
        `${visceralFat} : Visceral Fat %`,
        subcutaneousFat != null ? `${subcutaneousFat.toFixed(1)}% : Subcutaneous Fat %` : null,
        bmr != null ? `${Math.round(bmr)} kcal : BMR Calories` : null,
        `${bmi.toFixed(1)} : BMI`,
      ]
        .filter(Boolean)
        .join('\n')

      // 3. Open WhatsApp with the pre-filled caption
      //    Trainer then manually attaches the downloaded PDF in the chat
      const waUrl = `https://wa.me/?text=${encodeURIComponent(caption)}`
      window.open(waUrl, '_blank', 'noopener,noreferrer')
    } catch {
      setError('Failed to prepare share')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        onClick={handleShare}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 active:bg-green-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Preparing…
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.555 4.104 1.523 5.828L0 24l6.352-1.499C8.047 23.447 9.987 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.892 0-3.665-.516-5.181-1.411l-.371-.22-3.827.903.965-3.719-.241-.388C2.527 15.68 2 13.905 2 12 2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
            </svg>
            Share via WhatsApp
          </>
        )}
      </button>
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  )
}
