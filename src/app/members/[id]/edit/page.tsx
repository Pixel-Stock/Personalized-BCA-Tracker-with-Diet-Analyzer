// src/app/members/[id]/edit/page.tsx
import React from 'react'
import { createServerClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'
import { MemberForm } from '@/components/members/MemberForm'

export const dynamic = 'force-dynamic'

export default async function EditMemberPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { id } = await params

  const member = await prisma.member.findUnique({
    where: { id },
    include: { dietaryProfile: true, assessments: { orderBy: { date: 'desc' } } },
  })

  if (!member) notFound()

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar userEmail={user.email} />
      <main className="flex-1 lg:ml-56">
        <TopBar title={`Edit — ${member.name}`} subtitle={`Member ID: ${member.memberId}`} />
        <div className="p-6 animate-fade-in">
          <MemberForm mode="edit" defaultValues={member} memberId={id} />
        </div>
      </main>
    </div>
  )
}
