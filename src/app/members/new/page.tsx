// src/app/members/new/page.tsx
import React from 'react'
import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'
import { MemberForm } from '@/components/members/MemberForm'
import { formatMemberIdSuggestion } from '@/lib/utils/formatters'

export const dynamic = 'force-dynamic'

export default async function NewMemberPage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const totalMembers = await prisma.member.count()
  const nextMemberId = formatMemberIdSuggestion(totalMembers)

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar userEmail={user.email} />
      <main className="flex-1 lg:ml-56">
        <TopBar title="Add New Member" subtitle="Fill in the member's details and dietary preferences" />
        <div className="p-6 animate-fade-in">
          <MemberForm mode="create" nextMemberIdSuggestion={nextMemberId} />
        </div>
      </main>
    </div>
  )
}
