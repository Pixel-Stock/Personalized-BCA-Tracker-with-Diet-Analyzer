// prisma/seed.ts
// Seed script — creates sample gym, 5 members, and 2-3 assessments each

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding FitnessTouch database...')

  // 1. Gym Settings
  const existingSettings = await prisma.gymSettings.findFirst()
  if (!existingSettings) {
    await prisma.gymSettings.create({
      data: {
        gymName: 'FitnessTouch Demo Gym',
        tagline: 'Transform Your Body, Transform Your Life',
        address: '123 Fitness Avenue, Mumbai, Maharashtra 400001',
        phone: '+91 98765 43210',
        primaryColor: '#1a56db',
      },
    })
    console.log('✅ Gym settings created')
  }

  // 2. Members with assessments
  const members = [
    {
      memberId: 'FT0001',
      name: 'Arjun Mehta',
      age: 28,
      gender: 'MALE' as const,
      height: 175,
      goal: 'FAT_LOSS' as const,
      trainingLevel: 'INTERMEDIATE' as const,
      phone: '+91 99887 76655',
      email: 'arjun@example.com',
      dietaryProfile: {
        dietType: 'NON_VEGETARIAN' as const,
        mealsPerDay: 4,
        supplementsAllowed: true,
      },
      assessments: [
        {
          date: new Date('2026-04-15'),
          weight: 84.5,
          bmi: 27.6,
          bodyFat: 26.2,
          musclePct: 34.1,
          visceralFat: 11,
          bodyWater: 52.3,
          metabolicAge: 33,
        },
        {
          date: new Date('2026-05-15'),
          weight: 81.2,
          bmi: 26.5,
          bodyFat: 23.8,
          musclePct: 35.2,
          visceralFat: 9,
          bodyWater: 54.1,
          metabolicAge: 31,
        },
        {
          date: new Date('2026-06-14'),
          weight: 78.9,
          bmi: 25.8,
          bodyFat: 21.3,
          musclePct: 36.5,
          visceralFat: 8,
          bodyWater: 55.8,
          metabolicAge: 29,
        },
      ],
    },
    {
      memberId: 'FT0002',
      name: 'Priya Sharma',
      age: 25,
      gender: 'FEMALE' as const,
      height: 162,
      goal: 'RECOMPOSITION' as const,
      trainingLevel: 'BEGINNER' as const,
      phone: '+91 98765 11223',
      dietaryProfile: {
        dietType: 'VEGETARIAN' as const,
        mealsPerDay: 3,
        supplementsAllowed: true,
      },
      assessments: [
        {
          date: new Date('2026-05-01'),
          weight: 62.5,
          bmi: 23.8,
          bodyFat: 31.2,
          musclePct: 30.5,
          visceralFat: 5,
          bodyWater: 47.8,
          metabolicAge: 28,
        },
        {
          date: new Date('2026-06-10'),
          weight: 61.8,
          bmi: 23.5,
          bodyFat: 29.8,
          musclePct: 31.4,
          visceralFat: 4,
          bodyWater: 49.2,
          metabolicAge: 26,
        },
      ],
    },
    {
      memberId: 'FT0003',
      name: 'Rahul Nair',
      age: 32,
      gender: 'MALE' as const,
      height: 180,
      goal: 'MUSCLE_GAIN' as const,
      trainingLevel: 'ADVANCED' as const,
      phone: '+91 77665 44332',
      dietaryProfile: {
        dietType: 'NON_VEGETARIAN' as const,
        mealsPerDay: 5,
        supplementsAllowed: true,
      },
      assessments: [
        {
          date: new Date('2026-04-01'),
          weight: 72.0,
          bmi: 22.2,
          bodyFat: 14.5,
          musclePct: 44.8,
          visceralFat: 4,
          bodyWater: 60.2,
          metabolicAge: 25,
        },
        {
          date: new Date('2026-05-05'),
          weight: 74.5,
          bmi: 23.0,
          bodyFat: 14.2,
          musclePct: 46.1,
          visceralFat: 4,
          bodyWater: 61.0,
          metabolicAge: 24,
        },
        {
          date: new Date('2026-06-12'),
          weight: 76.2,
          bmi: 23.5,
          bodyFat: 13.8,
          musclePct: 47.5,
          visceralFat: 3,
          bodyWater: 62.1,
          metabolicAge: 23,
        },
      ],
    },
    {
      memberId: 'FT0004',
      name: 'Sneha Patel',
      age: 30,
      gender: 'FEMALE' as const,
      height: 158,
      goal: 'MAINTENANCE' as const,
      trainingLevel: 'INTERMEDIATE' as const,
      dietaryProfile: {
        dietType: 'VEGAN' as const,
        mealsPerDay: 3,
        supplementsAllowed: false,
      },
      assessments: [
        {
          date: new Date('2026-05-20'),
          weight: 55.0,
          bmi: 22.0,
          bodyFat: 24.5,
          musclePct: 32.2,
          visceralFat: 3,
          bodyWater: 51.0,
          metabolicAge: 28,
        },
      ],
    },
    {
      memberId: 'FT0005',
      name: 'Vikram Singh',
      age: 45,
      gender: 'MALE' as const,
      height: 173,
      goal: 'FAT_LOSS' as const,
      trainingLevel: 'BEGINNER' as const,
      phone: '+91 99000 11122',
      dietaryProfile: {
        dietType: 'JAIN' as const,
        mealsPerDay: 2,
        supplementsAllowed: false,
        lateNightEating: false,
        frequentSnacking: false,
      },
      assessments: [
        {
          date: new Date('2026-03-15'),
          weight: 96.0,
          bmi: 32.1,
          bodyFat: 35.8,
          musclePct: 27.5,
          visceralFat: 18,
          bodyWater: 44.2,
          metabolicAge: 52,
        },
        {
          date: new Date('2026-05-15'),
          weight: 91.5,
          bmi: 30.6,
          bodyFat: 33.1,
          musclePct: 28.2,
          visceralFat: 15,
          bodyWater: 46.0,
          metabolicAge: 49,
        },
      ],
    },
  ]

  for (const memberData of members) {
    const { assessments, dietaryProfile, ...memberInfo } = memberData

    // Check if member already exists
    const existing = await prisma.member.findUnique({
      where: { memberId: memberInfo.memberId },
    })

    if (existing) {
      console.log(`⏭ Skipping ${memberInfo.name} (already exists)`)
      continue
    }

    const member = await prisma.member.create({
      data: {
        ...memberInfo,
        dietaryProfile: { create: dietaryProfile },
      },
    })

    // Create assessments
    for (const assessment of assessments) {
      await prisma.assessment.create({
        data: { ...assessment, memberId: member.id },
      })
    }

    console.log(`✅ Created ${member.name} with ${assessments.length} assessments`)
  }

  console.log('\n🎉 Seeding complete! You can now log in and explore FitnessTouch.')
  console.log('💡 Create a trainer account in Supabase Dashboard → Authentication → Users')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('Seed error:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
