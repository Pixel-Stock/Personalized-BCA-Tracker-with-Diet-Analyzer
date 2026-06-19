// src/lib/gymConfig.ts
// Single source of truth for gym branding.
// Update these values with your gym's real details.

export const GYM_CONFIG = {
  id: 'default',
  gymName: 'FitnessTouch',
  tagline: 'Transform Your Body. Transform Your Life.',
  address: 'Gym Address, City, State',
  phone: '+91 00000 00000',
  logoUrl: null as string | null,         // Set to a public image URL when ready
  primaryColor: '#1a56db',
  updatedAt: new Date(),
} as const satisfies import('@/types').GymSettings

