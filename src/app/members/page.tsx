'use client'
// src/app/members/page.tsx
import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'
import { MemberCard } from '@/components/members/MemberCard'
import { MemberSearch } from '@/components/members/MemberSearch'
import { Button } from '@/components/ui/Button'
import type { MemberListItem } from '@/types'

export default function MembersPage() {
  const [members, setMembers] = useState<MemberListItem[]>([])
  const [filtered, setFiltered] = useState<MemberListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [userEmail, setUserEmail] = useState<string>()

  useEffect(() => {
    // Get user info
    import('@/lib/supabase').then(({ createClient }) => {
      const supabase = createClient()
      supabase.auth.getUser().then(({ data: { user } }) => {
        setUserEmail(user?.email)
      })
    })

    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/members')
      const data = await res.json()
      setMembers(data.members ?? [])
      setFiltered(data.members ?? [])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = useCallback(
    (query: string) => {
      if (!query.trim()) {
        setFiltered(members)
        return
      }
      const q = query.toLowerCase()
      setFiltered(
        members.filter(
          (m) =>
            m.name.toLowerCase().includes(q) ||
            m.memberId.toLowerCase().includes(q)
        )
      )
    },
    [members]
  )

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar userEmail={userEmail} />
      <main className="flex-1 lg:ml-56">
        <TopBar
          title="Members"
          subtitle={`${members.length} total members`}
          actions={
            <Link href="/members/new">
              <Button id="add-member-btn">+ Add Member</Button>
            </Link>
          }
        />
        <div className="p-6 animate-fade-in">
          {/* Search */}
          <div className="mb-6">
            <MemberSearch onSearch={handleSearch} />
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-3 w-3/4" />
                  <div className="h-3 bg-gray-100 rounded mb-4 w-1/2" />
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="h-12 bg-gray-100 rounded-lg" />
                    <div className="h-12 bg-gray-100 rounded-lg" />
                  </div>
                  <div className="flex gap-2">
                    <div className="h-8 bg-gray-100 rounded-lg flex-1" />
                    <div className="h-8 bg-blue-100 rounded-lg flex-1" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="font-medium">No members found</p>
              <p className="text-sm mt-1">
                {members.length === 0 ? 'Add your first member to get started' : 'Try a different search term'}
              </p>
              {members.length === 0 && (
                <Link href="/members/new" className="mt-4 inline-block">
                  <Button>Add First Member</Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((member) => (
                <MemberCard key={member.id} member={member} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
