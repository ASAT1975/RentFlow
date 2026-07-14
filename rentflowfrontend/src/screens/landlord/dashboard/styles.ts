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
    marginBottom: 20,
  },
  greeting: {
    fontSize: 20,
    fontWeight: '800',
    color: Brand.textPrimary,
  },
  greetingSub: {
    marginTop: 2,
    fontSize: 13,
    color: Brand.textSecondary,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Brand.primarySoft,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '800',
    color: Brand.primary,
  },

  // Revenue hero.
  revenueCard: {
    borderRadius: 24,
    padding: 22,
    overflow: 'hidden',
  },
  revenueLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.85)',
  },
  revenueValue: {
    marginTop: 6,
    fontSize: 38,
    fontWeight: '800',
    letterSpacing: -0.5,
    color: Brand.onHero,
  },
  barTrack: {
    marginTop: 18,
    height: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.25)',
    overflow: 'hidden',
  },
  barFill: {
    height: 8,
    borderRadius: 999,
    backgroundColor: Brand.onHero,
  },
  revenueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  revenueMeta: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
  },

  // Stats grid.
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 16,
  },
  statCard: {
    width: '47.8%',
    flexGrow: 1,
    padding: 16,
    borderRadius: 18,
    backgroundColor: Brand.surface,
    borderWidth: 1,
    borderColor: Brand.border,
  },
  statIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: Brand.textPrimary,
  },
  statLabel: {
    marginTop: 1,
    fontSize: 13,
    color: Brand.textSecondary,
  },

  // Sections.
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 26,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: Brand.textPrimary,
  },
  badgeCount: {
    minWidth: 22,
    paddingHorizontal: 7,
    paddingVertical: 1,
    borderRadius: 999,
    overflow: 'hidden',
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'center',
    color: Brand.onPrimary,
    backgroundColor: Brand.danger,
  },

  card: {
    borderRadius: 18,
    backgroundColor: Brand.surface,
    borderWidth: 1,
    borderColor: Brand.border,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
  },
  divider: {
    height: 1,
    backgroundColor: Brand.border,
    marginLeft: 16,
  },
  emojiTile: {
    width: 44,
    height: 44,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Brand.surfaceAlt,
  },
  emoji: {
    fontSize: 20,
  },
  rowTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Brand.textPrimary,
  },
  rowMeta: {
    marginTop: 2,
    fontSize: 12,
    color: Brand.textSecondary,
  },
  rowTime: {
    fontSize: 12,
    color: Brand.textMuted,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
});
