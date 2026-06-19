// src/pdf/components/SectionHeader.tsx
import React from 'react'
import { View, Text } from '@react-pdf/renderer'
import { pdfStyles } from '../styles/pdfStyles'

interface SectionHeaderProps {
  title: string
  backgroundColor?: string
}

export function SectionHeader({ title, backgroundColor }: SectionHeaderProps) {
  return (
    <View
      style={[
        pdfStyles.sectionHeader,
        backgroundColor ? { backgroundColor } : {},
      ]}
    >
      <Text style={pdfStyles.sectionHeaderText}>{title}</Text>
    </View>
  )
}
