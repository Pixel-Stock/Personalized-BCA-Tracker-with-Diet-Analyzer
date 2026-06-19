// src/pdf/styles/pdfStyles.ts
// All StyleSheet.create definitions for @react-pdf/renderer

import { StyleSheet } from '@react-pdf/renderer'

export const colors = {
  primary: '#1a56db',
  primaryLight: '#dbeafe',
  white: '#ffffff',
  black: '#111827',
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray600: '#4b5563',
  gray700: '#374151',
  green: '#16a34a',
  greenLight: '#dcfce7',
  amber: '#d97706',
  amberLight: '#fef3c7',
  red: '#dc2626',
  redLight: '#fee2e2',
  blue: '#2563eb',
  blueLight: '#dbeafe',
}

export const pdfStyles = StyleSheet.create({
  // ── Page ────────────────────────────────────────────────────────────────────
  page: {
    fontFamily: 'Helvetica',
    backgroundColor: colors.white,
    paddingTop: 40,
    paddingBottom: 60,
    paddingHorizontal: 40,
  },

  // ── Cover page ──────────────────────────────────────────────────────────────
  coverHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  gymLogo: {
    width: 80,
    height: 80,
    marginBottom: 12,
    borderRadius: 8,
  },
  gymName: {
    fontSize: 28,
    fontFamily: 'Helvetica-Bold',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 4,
  },
  gymTagline: {
    fontSize: 11,
    color: colors.gray500,
    textAlign: 'center',
  },
  dividerBar: {
    height: 4,
    backgroundColor: colors.primary,
    borderRadius: 2,
    marginVertical: 20,
  },
  reportTitle: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: colors.gray700,
    textAlign: 'center',
    marginBottom: 24,
  },

  // ── Info table ───────────────────────────────────────────────────────────────
  infoTable: {
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  infoRowLast: {
    flexDirection: 'row',
  },
  infoCell: {
    flex: 1,
    padding: 10,
  },
  infoCellAlt: {
    flex: 1,
    padding: 10,
    backgroundColor: colors.gray50,
  },
  infoLabel: {
    fontSize: 8,
    color: colors.gray500,
    marginBottom: 3,
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: colors.black,
  },

  // ── Section header ──────────────────────────────────────────────────────────
  sectionHeader: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
    marginBottom: 16,
  },
  sectionHeaderText: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: colors.white,
  },

  // ── Metric grid (Page 2) ────────────────────────────────────────────────────
  metricGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricCard: {
    width: '47%',
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: 8,
    padding: 14,
    backgroundColor: colors.gray50,
  },
  metricLabel: {
    fontSize: 9,
    color: colors.gray500,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  metricValue: {
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    color: colors.black,
    marginBottom: 4,
  },
  metricUnit: {
    fontSize: 12,
    color: colors.gray500,
    fontFamily: 'Helvetica',
  },
  metricRange: {
    fontSize: 9,
    color: colors.gray500,
    marginBottom: 6,
  },

  // ── Status badges ────────────────────────────────────────────────────────────
  badgeHealthy: {
    backgroundColor: colors.greenLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 100,
    alignSelf: 'flex-start',
  },
  badgeAbove: {
    backgroundColor: colors.amberLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 100,
    alignSelf: 'flex-start',
  },
  badgeBelow: {
    backgroundColor: colors.redLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 100,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
  },
  badgeHealthyText: { color: colors.green },
  badgeAboveText: { color: colors.amber },
  badgeBelowText: { color: colors.red },

  // ── Comparison table (Page 3) ────────────────────────────────────────────────
  table: {
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.gray100,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  tableRowAlt: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
    backgroundColor: colors.gray50,
  },
  tableHeaderCell: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: colors.gray600,
    textTransform: 'uppercase',
  },
  tableCell: {
    fontSize: 10,
    color: colors.gray700,
  },
  col1: { flex: 2 },
  col2: { flex: 1.5, textAlign: 'center' },
  col3: { flex: 1.5, textAlign: 'center' },
  col4: { flex: 2, textAlign: 'center' },

  // ── Delta colors ──────────────────────────────────────────────────────────────
  deltaGood: { color: colors.green, fontSize: 10, fontFamily: 'Helvetica-Bold' },
  deltaBad: { color: colors.red, fontSize: 10, fontFamily: 'Helvetica-Bold' },
  deltaNeutral: { color: colors.gray500, fontSize: 10 },

  // ── Baseline banner ──────────────────────────────────────────────────────────
  baselineBanner: {
    backgroundColor: colors.blueLight,
    borderWidth: 1,
    borderColor: colors.blue,
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  baselineBannerTitle: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: colors.blue,
    marginBottom: 8,
  },
  baselineBannerText: {
    fontSize: 10,
    color: colors.blue,
    textAlign: 'center',
    lineHeight: 1.5,
  },

  // ── Interpretation block ──────────────────────────────────────────────────────
  interpretationBlock: {
    backgroundColor: colors.gray50,
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
  },
  interpretationTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: colors.gray700,
    marginBottom: 8,
  },
  interpretationItem: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  interpretationBullet: {
    fontSize: 10,
    color: colors.primary,
    marginRight: 6,
  },
  interpretationText: {
    fontSize: 10,
    color: colors.gray600,
    flex: 1,
    lineHeight: 1.4,
  },

  // ── Overall status ────────────────────────────────────────────────────────────
  statusExcellent: {
    backgroundColor: colors.greenLight,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  statusGood: {
    backgroundColor: '#d1fae5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  statusModerate: {
    backgroundColor: colors.amberLight,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  statusAttention: {
    backgroundColor: colors.redLight,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
  },

  // ── Nutrition (Page 4) ────────────────────────────────────────────────────────
  calorieDisplay: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    padding: 20,
  },
  calorieNumber: {
    fontSize: 48,
    fontFamily: 'Helvetica-Bold',
    color: colors.primary,
  },
  calorieLabel: {
    fontSize: 12,
    color: colors.primary,
    marginTop: 4,
  },
  macroRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  macroLabel: { flex: 2, fontSize: 11, color: colors.gray700 },
  macroGrams: {
    flex: 2,
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: colors.black,
    textAlign: 'center',
  },
  macroPct: { flex: 1, fontSize: 10, color: colors.gray500, textAlign: 'right' },

  hydrationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0f2fe',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    gap: 8,
  },
  hydrationText: {
    fontSize: 11,
    color: '#0369a1',
    fontFamily: 'Helvetica-Bold',
  },

  bulletItem: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  bulletDot: {
    fontSize: 10,
    color: colors.primary,
    marginRight: 6,
    marginTop: 1,
  },
  bulletText: {
    fontSize: 10,
    color: colors.gray600,
    flex: 1,
    lineHeight: 1.5,
  },

  supplementDisclaimer: {
    fontSize: 8,
    color: colors.gray400,
    marginTop: 8,
    fontStyle: 'italic',
  },

  goalNote: {
    fontSize: 9,
    color: colors.gray500,
    fontStyle: 'italic',
    marginTop: 8,
    textAlign: 'center',
  },

  // ── Summary (Page 5) ──────────────────────────────────────────────────────────
  recommendationCard: {
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: 8,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
  },
  recommendationNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  recommendationNumberText: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: colors.white,
  },
  recommendationText: {
    fontSize: 10,
    color: colors.gray700,
    flex: 1,
    lineHeight: 1.5,
  },

  nextAssessmentBox: {
    backgroundColor: colors.primaryLight,
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
    alignItems: 'center',
  },
  nextAssessmentLabel: {
    fontSize: 9,
    color: colors.primary,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  nextAssessmentDate: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: colors.primary,
  },

  motivationalText: {
    fontSize: 11,
    color: colors.gray500,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 1.6,
    marginVertical: 16,
    paddingHorizontal: 20,
  },

  // ── Footer ────────────────────────────────────────────────────────────────────
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
    paddingTop: 8,
  },
  footerText: {
    fontSize: 8,
    color: colors.gray400,
  },
  footerBrand: {
    fontSize: 8,
    color: colors.primary,
    fontFamily: 'Helvetica-Bold',
  },

  // ── Spacing helpers ───────────────────────────────────────────────────────────
  mb4: { marginBottom: 4 },
  mb8: { marginBottom: 8 },
  mb12: { marginBottom: 12 },
  mb16: { marginBottom: 16 },
  mb20: { marginBottom: 20 },
  mt8: { marginTop: 8 },
  mt12: { marginTop: 12 },
})
