import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createServerClient } from '@/lib/supabase/server'
import { comparisonEngine } from '@/lib/engines/comparisonEngine'
import { nutritionEngine } from '@/lib/engines/nutritionEngine'
import { renderToBuffer } from '@react-pdf/renderer'
import { ReportDocument } from '@/pdf/ReportDocument'
import { format } from 'date-fns'
import React from 'react'
import type { ReportData } from '@/types'

export const dynamic = 'force-dynamic'
export const maxDuration = 60


export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ assessmentId: string }> }
) {
  try {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { assessmentId } = await params

    // 1. Fetch the target assessment
    const currentAssessment = await prisma.assessment.findUnique({
      where: { id: assessmentId },
    })
    if (!currentAssessment) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 })
    }

    // 2. Fetch member with dietary profile
    const member = await prisma.member.findUnique({
      where: { id: currentAssessment.memberId },
      include: {
        dietaryProfile: true,
        assessments: { orderBy: { date: 'desc' } },
      },
    })
    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 })
    }

    // 3. Fetch previous assessment (the one immediately before current date)
    const previousAssessment = await prisma.assessment.findFirst({
      where: {
        memberId: currentAssessment.memberId,
        date: { lt: currentAssessment.date },
      },
      orderBy: { date: 'desc' },
    })

    // 4. Run comparison engine
    const comparison = comparisonEngine(currentAssessment, previousAssessment)

    // 5. Run nutrition engine
    const nutrition = nutritionEngine(member, member.dietaryProfile, currentAssessment)

    // 6. Fetch gym settings
    let gymSettings = await prisma.gymSettings.findFirst()
    if (!gymSettings) {
      gymSettings = await prisma.gymSettings.create({
        data: { gymName: 'FitnessTouch', primaryColor: '#1a56db' },
      })
    }

    // 7. Render PDF
    const reportData = {
      member,
      currentAssessment,
      previousAssessment,
      comparison,
      nutrition,
      gymSettings,
    }

    const pdfBuffer = await renderToBuffer(
      // Use type assertion to avoid version-specific Document prop type mismatch
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      React.createElement(ReportDocument, { data: reportData as ReportData }) as any
    )

    // 8. Build filename
    const memberNameSlug = member.name.replace(/\s+/g, '_')
    const dateSlug = format(new Date(currentAssessment.date), 'dd-MMM-yyyy')
    const filename = `FitnessTouch_${memberNameSlug}_${dateSlug}.pdf`

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    })
  } catch (error: any) {
    console.error('GET /api/report/[assessmentId] error:', error)
    return NextResponse.json({ error: `Failed to generate PDF report: ${error.message}` }, { status: 500 })
  }
}

