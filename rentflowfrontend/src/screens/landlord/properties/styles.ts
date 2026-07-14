import { StyleSheet } from 'react-native';

import { Brand } from '@/constants/brand';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Brand.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: Brand.textPrimary,
  },
  addBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Brand.primary,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 28,
  },

  // Summary strip.
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: 18,
    backgroundColor: Brand.surface,
    borderWidth: 1,
    borderColor: Brand.border,
    marginBottom: 16,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '800',
    color: Brand.textPrimary,
  },
  summaryLabel: {
    marginTop: 2,
    fontSize: 12,
    color: Brand.textSecondary,
  },
  summaryDivider: {
    width: 1,
    height: 34,
    backgroundColor: Brand.border,
  },

  // Property card.
  card: {
    padding: 16,
    borderRadius: 20,
    marginBottom: 14,
    backgroundColor: Brand.surface,
    borderWidth: 1,
    borderColor: Brand.border,
  },
  cardPressed: {
    backgroundColor: Brand.surfaceAlt,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  emojiTile: {
    width: 50,
    height: 50,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Brand.surfaceAlt,
  },
  emoji: {
    fontSize: 24,
  },
  name: {
    fontSize: 16,
    fontWeight: '800',
    color: Brand.textPrimary,
  },
  location: {
    marginTop: 2,
    fontSize: 13,
    color: Brand.textSecondary,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '700',
    color: Brand.textPrimary,
  },

  occRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 8,
  },
  occLabel: {
    fontSize: 13,
    color: Brand.textSecondary,
  },
  occPct: {
    fontSize: 13,
    fontWeight: '700',
    color: Brand.textPrimary,
  },
  barTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: Brand.surfaceAlt,
    overflow: 'hidden',
  },
  barFill: {
    height: 8,
    borderRadius: 999,
    backgroundColor: Brand.primary,
  },

  revenueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: Brand.border,
  },
  revenueLabel: {
    fontSize: 13,
    color: Brand.textSecondary,
  },
  revenueValue: {
    fontSize: 16,
    fontWeight: '800',
    color: Brand.textPrimary,
  },

  // Empty / loading state.
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
    gap: 8,
  },
  emptyTitle: {
    marginTop: 6,
    fontSize: 16,
    fontWeight: '800',
    color: Brand.textPrimary,
  },
  emptyBody: {
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    color: Brand.textSecondary,
  },
});
