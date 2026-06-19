// src/app/api/members/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/members/[id] — get member with full relations
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const member = await prisma.member.findUnique({
      where: { id },
      include: {
        dietaryProfile: true,
        assessments: { orderBy: { date: 'desc' } },
      },
    })

    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 })
    }

    return NextResponse.json({ member })
  } catch (error) {
    console.error('GET /api/members/[id] error:', error)
    return NextResponse.json({ error: 'Failed to fetch member' }, { status: 500 })
  }
}

// PUT /api/members/[id] — partial update member + dietary profile
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { dietaryProfile, joinDate, ...memberData } = body

    await prisma.$transaction(async (tx) => {
      await tx.member.update({
        where: { id },
        data: {
          ...memberData,
          ...(joinDate ? { joinDate: new Date(joinDate) } : {}),
        },
      })

      if (dietaryProfile) {
        await tx.dietaryProfile.upsert({
          where: { memberId: id },
          create: { memberId: id, ...dietaryProfile },
          update: dietaryProfile,
        })
      }
    })

    const fullMember = await prisma.member.findUnique({
      where: { id },
      include: { dietaryProfile: true, assessments: { orderBy: { date: 'desc' } } },
    })

    return NextResponse.json({ member: fullMember })
  } catch (error) {
    console.error('PUT /api/members/[id] error:', error)
    return NextResponse.json({ error: 'Failed to update member' }, { status: 500 })
  }
}

// DELETE /api/members/[id] — hard delete (cascades via Prisma schema)
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.member.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/members/[id] error:', error)
    return NextResponse.json({ error: 'Failed to delete member' }, { status: 500 })
  }
}
