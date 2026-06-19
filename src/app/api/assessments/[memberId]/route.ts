// src/app/api/assessments/[memberId]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/assessments/[memberId] — all assessments for a member
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ memberId: string }> }
) {
  try {
    const { memberId } = await params

    const assessments = await prisma.assessment.findMany({
      where: { memberId },
      orderBy: { date: 'desc' },
    })

    return NextResponse.json({ assessments })
  } catch (error) {
    console.error('GET /api/assessments/[memberId] error:', error)
    return NextResponse.json({ error: 'Failed to fetch assessments' }, { status: 500 })
  }
}
