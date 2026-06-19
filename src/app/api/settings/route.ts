// src/app/api/settings/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createServerClient, createAdminClient } from '@/lib/supabase/server'
import { GymSettingsSchema } from '@/lib/utils/validators'

// GET /api/settings — return gym settings (create default if none exists)
export async function GET(_request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    let settings = await prisma.gymSettings.findFirst()

    if (!settings) {
      settings = await prisma.gymSettings.create({
        data: { gymName: 'My Gym', primaryColor: '#1a56db' },
      })
    }

    return NextResponse.json({ settings })
  } catch (error) {
    console.error('GET /api/settings error:', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

// PUT /api/settings — update gym settings (supports logo upload via multipart)
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const contentType = request.headers.get('content-type') ?? ''
    let updateData: Record<string, string> = {}
    let logoUrl: string | undefined

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()

      // Extract text fields
      const gymName = formData.get('gymName') as string | null
      const tagline = formData.get('tagline') as string | null
      const address = formData.get('address') as string | null
      const phone = formData.get('phone') as string | null
      const primaryColor = formData.get('primaryColor') as string | null

      if (gymName) updateData.gymName = gymName
      if (tagline !== null) updateData.tagline = tagline
      if (address !== null) updateData.address = address
      if (phone !== null) updateData.phone = phone
      if (primaryColor) updateData.primaryColor = primaryColor

      // Handle logo upload
      const logoFile = formData.get('logo') as File | null
      if (logoFile && logoFile.size > 0) {
        const adminClient = createAdminClient()
        const arrayBuffer = await logoFile.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        const { error: uploadError } = await adminClient.storage
          .from('gym-logos')
          .upload('logo.png', buffer, {
            contentType: logoFile.type || 'image/png',
            upsert: true,
          })

        if (uploadError) {
          console.error('Logo upload error:', uploadError)
          return NextResponse.json({ error: 'Logo upload failed' }, { status: 500 })
        }

        const { data: urlData } = adminClient.storage
          .from('gym-logos')
          .getPublicUrl('logo.png')

        logoUrl = urlData.publicUrl
      }
    } else {
      const body = await request.json()
      const parsed = GymSettingsSchema.safeParse(body)
      if (!parsed.success) {
        return NextResponse.json({ error: 'Validation failed' }, { status: 400 })
      }
      updateData = parsed.data as Record<string, string>
    }

    // Get existing settings or create
    let settings = await prisma.gymSettings.findFirst()

    if (!settings) {
      settings = await prisma.gymSettings.create({
        data: {
          gymName: updateData.gymName || 'My Gym',
          primaryColor: '#1a56db',
          ...(logoUrl ? { logoUrl } : {}),
        },
      })
    } else {
      settings = await prisma.gymSettings.update({
        where: { id: settings.id },
        data: {
          ...updateData,
          ...(logoUrl ? { logoUrl } : {}),
        },
      })
    }

    return NextResponse.json({ settings })
  } catch (error) {
    console.error('PUT /api/settings error:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
