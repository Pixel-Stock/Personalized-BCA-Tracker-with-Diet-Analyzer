// src/app/api/members/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { MemberSchema } from '@/lib/utils/validators'

// GET /api/members — list all members with optional search
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')

    const members = await prisma.member.findMany({
      where: search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { memberId: { contains: search, mode: 'insensitive' } },
            ],
          }
        : undefined,
      include: {
        dietaryProfile: true,
        assessments: {
          orderBy: { date: 'desc' },
          take: 1,
          select: { id: true, date: true, weight: true, bodyFat: true, musclePct: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ members, total: members.length })
  } catch (error) {
    console.error('GET /api/members error:', error)
    return NextResponse.json({ error: 'Failed to fetch members' }, { status: 500 })
  }
}

// POST /api/members — create new member with dietary profile
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = MemberSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { dietaryProfile, joinDate, ...memberData } = parsed.data

    // Check for duplicate memberId
    const existing = await prisma.member.findUnique({
      where: { memberId: memberData.memberId },
    })
    if (existing) {
      return NextResponse.json(
        { error: 'A member with this ID already exists' },
        { status: 409 }
      )
    }

    const member = await prisma.$transaction(async (tx) => {
      const newMember = await tx.member.create({
        data: {
          ...memberData,
          joinDate: new Date(joinDate),
          dietaryProfile: {
            create: dietaryProfile,
          },
        },
        include: { dietaryProfile: true },
      })
      return newMember
    })

    return NextResponse.json({ member }, { status: 201 })
  } catch (error) {
    console.error('POST /api/members error:', error)
    return NextResponse.json({ error: 'Failed to create member' }, { status: 500 })
  }
}
