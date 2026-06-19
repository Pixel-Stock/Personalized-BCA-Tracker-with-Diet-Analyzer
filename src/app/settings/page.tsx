'use client'
// src/app/settings/page.tsx
import React, { useState, useEffect, useRef } from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import Image from 'next/image'

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    gymName: '',
    tagline: '',
    address: '',
    phone: '',
    primaryColor: '#1a56db',
    logoUrl: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [userEmail, setUserEmail] = useState<string>()
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    import('@/lib/supabase').then(({ createClient }) => {
      const supabase = createClient()
      supabase.auth.getUser().then(({ data: { user } }) => setUserEmail(user?.email))
    })

    fetch('/api/settings')
      .then((r) => r.json())
      .then((d) => {
        if (d.settings) setSettings(d.settings)
      })
      .finally(() => setLoading(false))
  }, [])

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setLogoFile(file)
    setLogoPreview(URL.createObjectURL(file))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      let res: Response

      if (logoFile) {
        const formData = new FormData()
        Object.entries(settings).forEach(([k, v]) => formData.append(k, v))
        formData.append('logo', logoFile)
        res = await fetch('/api/settings', { method: 'PUT', body: formData })
      } else {
        res = await fetch('/api/settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(settings),
        })
      }

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to save settings')
        return
      }
      setSettings(data.settings)
      setSuccess(true)
      setLogoFile(null)
      setTimeout(() => setSuccess(false), 3000)
    } catch {
      setError('Network error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 lg:ml-56 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar userEmail={userEmail} />
      <main className="flex-1 lg:ml-56">
        <TopBar title="Gym Settings" subtitle="Manage branding and contact details used in PDF reports" />
        <div className="p-6 animate-fade-in">
          <form onSubmit={handleSave} className="max-w-2xl space-y-6">
            {success && (
              <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Settings saved successfully!
              </div>
            )}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>
            )}

            {/* Gym Info */}
            <Card title="Gym Information">
              <div className="space-y-4">
                <Input
                  label="Gym Name"
                  required
                  value={settings.gymName}
                  onChange={(e) => setSettings({ ...settings, gymName: e.target.value })}
                />
                <Input
                  label="Tagline"
                  placeholder="e.g. Transform Your Body, Transform Your Life"
                  value={settings.tagline}
                  onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Address</label>
                  <textarea
                    value={settings.address}
                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                    rows={2}
                    placeholder="Gym address (appears in PDF footer)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
                <Input
                  label="Phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                />
              </div>
            </Card>

            {/* Branding */}
            <Card title="Branding">
              <div className="space-y-4">
                {/* Logo Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gym Logo
                  </label>
                  <div className="flex items-center gap-4">
                    {(logoPreview || settings.logoUrl) && (
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200">
                        <Image
                          src={logoPreview || settings.logoUrl}
                          alt="Gym logo"
                          fill
                          className="object-contain p-1"
                        />
                      </div>
                    )}
                    <div>
                      <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id="logo-upload"
                        onChange={handleLogoChange}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileRef.current?.click()}
                      >
                        {settings.logoUrl ? 'Change Logo' : 'Upload Logo'}
                      </Button>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG or SVG. Max 2MB.</p>
                    </div>
                  </div>
                </div>

                {/* Primary Color */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Color
                    <span className="text-xs text-gray-400 ml-2">(used for report accent colors)</span>
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      id="primary-color"
                      value={settings.primaryColor}
                      onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                      className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      value={settings.primaryColor}
                      onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                      placeholder="#1a56db"
                      className="w-32 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    />
                    <div
                      className="w-8 h-8 rounded-lg border border-gray-200"
                      style={{ backgroundColor: settings.primaryColor }}
                    />
                  </div>
                </div>
              </div>
            </Card>

            <Button type="submit" loading={saving} size="lg" id="save-settings-btn">
              Save Settings
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}
