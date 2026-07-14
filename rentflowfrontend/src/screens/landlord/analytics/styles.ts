import { StyleSheet } from 'react-native';

import { Brand } from '@/constants/brand';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Brand.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: Brand.textPrimary,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 28,
  },

  card: {
    padding: 18,
    borderRadius: 20,
    backgroundColor: Brand.surface,
    borderWidth: 1,
    borderColor: Brand.border,
  },
  cardHead: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: Brand.textPrimary,
  },
  cardSub: {
    fontSize: 13,
    color: Brand.textSecondary,
  },

  // Bar chart.
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 130 + 24,
  },
  chartCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  bar: {
    width: 26,
    borderRadius: 8,
  },
  chartLabel: {
    marginTop: 8,
    fontSize: 12,
    color: Brand.textSecondary,
  },

  // Metrics grid.
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 16,
  },
  metricCard: {
    width: '47.8%',
    flexGrow: 1,
    padding: 16,
    borderRadius: 18,
    backgroundColor: Brand.surface,
    borderWidth: 1,
    borderColor: Brand.border,
  },
  metricIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '800',
    color: Brand.textPrimary,
  },
  metricLabel: {
    marginTop: 1,
    fontSize: 13,
    color: Brand.textSecondary,
  },

  // Section.
  sectionRow: {
    marginTop: 26,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: Brand.textPrimary,
  },

  // Revenue by property.
  propRow: {},
  propRowGap: {
    marginTop: 18,
  },
  propTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  propName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: Brand.textPrimary,
  },
  propValue: {
    fontSize: 14,
    fontWeight: '800',
    color: Brand.textPrimary,
  },
  hTrack: {
    height: 10,
    borderRadius: 999,
    backgroundColor: Brand.surfaceAlt,
    overflow: 'hidden',
  },
  hFill: {
    height: 10,
    borderRadius: 999,
    backgroundColor: Brand.primary,
  },
});
