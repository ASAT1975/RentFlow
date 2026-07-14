import { StyleSheet } from 'react-native';

import { Brand } from '@/constants/brand';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Brand.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 28,
  },

  // Header.
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Brand.surface,
    borderWidth: 1,
    borderColor: Brand.border,
  },
  headerCenter: {
    flex: 1,
    paddingRight: 14,
  },
  greeting: {
    fontSize: 17,
    fontWeight: '800',
    color: Brand.textPrimary,
  },
  greetingSub: {
    marginTop: 1,
    fontSize: 13,
    color: Brand.textSecondary,
  },
  bellDot: {
    position: 'absolute',
    top: 11,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Brand.danger,
    borderWidth: 1.5,
    borderColor: Brand.surface,
  },

  // Rent due hero.
  rentCard: {
    borderRadius: 24,
    padding: 22,
    overflow: 'hidden',
  },
  rentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rentLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.85)',
  },
  rentDate: {
    marginTop: 4,
    fontSize: 22,
    fontWeight: '800',
    color: Brand.onHero,
  },
  remainingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 5,
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  remainingText: {
    fontSize: 12,
    fontWeight: '700',
    color: Brand.onHero,
  },
  rentRight: {
    alignItems: 'flex-end',
  },
  outLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
  },
  outValue: {
    marginTop: 3,
    fontSize: 22,
    fontWeight: '800',
    color: Brand.onHero,
  },
  payButton: {
    marginTop: 20,
    height: 50,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Brand.onHero,
  },
  payButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  payButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: Brand.primary,
  },

  // Section heading.
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 26,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: Brand.textPrimary,
  },

  // Overview 2x2 grid.
  overviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  overviewCard: {
    width: '47.8%',
    flexGrow: 1,
    padding: 16,
    borderRadius: 18,
    backgroundColor: Brand.surface,
    borderWidth: 1,
    borderColor: Brand.border,
  },
  overviewIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  overviewLabel: {
    fontSize: 13,
    color: Brand.textSecondary,
  },
  overviewValue: {
    marginTop: 2,
    fontSize: 16,
    fontWeight: '800',
    color: Brand.textPrimary,
  },

  // Quick actions.
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionTile: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 18,
    backgroundColor: Brand.surface,
    borderWidth: 1,
    borderColor: Brand.border,
  },
  actionTilePressed: {
    backgroundColor: Brand.surfaceAlt,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Brand.textPrimary,
    textAlign: 'center',
  },

  // Payment history list.
  historyCard: {
    borderRadius: 18,
    backgroundColor: Brand.surface,
    borderWidth: 1,
    borderColor: Brand.border,
    overflow: 'hidden',
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
  },
  historyDivider: {
    height: 1,
    backgroundColor: Brand.border,
    marginLeft: 16,
  },
  historyIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Brand.successSoft,
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Brand.textPrimary,
  },
  historyDate: {
    marginTop: 2,
    fontSize: 12,
    color: Brand.textSecondary,
  },
  historyRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  historyAmount: {
    fontSize: 14,
    fontWeight: '800',
    color: Brand.textPrimary,
  },
  paidTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: Brand.successSoft,
  },
  paidTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: Brand.success,
  },
});
