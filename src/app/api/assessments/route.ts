// src/app/api/assessments/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { AssessmentSchema } from '@/lib/utils/validators'

// POST /api/assessments — create new assessment
export async function POST(request: NextRequest) {
  try {

    const body = await request.json()
    const parsed = AssessmentSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { date, ...rest } = parsed.data

    const assessment = await prisma.assessment.create({
      data: {
        ...rest,
        date: new Date(date),
      },
    })

    return NextResponse.json({ assessment }, { status: 201 })
  } catch (error) {
    console.error('POST /api/assessments error:', error)
    return NextResponse.json({ error: 'Failed to create assessment' }, { status: 500 })
  }
}
