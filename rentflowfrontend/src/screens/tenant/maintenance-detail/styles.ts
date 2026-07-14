import { StyleSheet } from 'react-native';

import { Brand } from '@/constants/brand';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Brand.background,
  },

  // Header.
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 12,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Brand.surface,
    borderWidth: 1,
    borderColor: Brand.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Brand.textPrimary,
  },
  spacer: {
    width: 40,
    height: 40,
  },

  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 32,
  },

  // Title card.
  titleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    borderRadius: 18,
    backgroundColor: Brand.surface,
    borderWidth: 1,
    borderColor: Brand.border,
  },
  emojiTile: {
    width: 52,
    height: 52,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Brand.surfaceAlt,
  },
  emoji: {
    fontSize: 24,
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: Brand.textPrimary,
  },
  category: {
    marginTop: 2,
    fontSize: 13,
    color: Brand.textSecondary,
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

  // Requested on.
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginTop: 16,
  },
  metaText: {
    fontSize: 13,
    color: Brand.textSecondary,
  },

  sectionLabel: {
    marginTop: 24,
    marginBottom: 10,
    fontSize: 14,
    fontWeight: '800',
    color: Brand.textPrimary,
  },
  block: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: Brand.surface,
    borderWidth: 1,
    borderColor: Brand.border,
  },
  descText: {
    fontSize: 14,
    lineHeight: 21,
    color: Brand.textSecondary,
  },

  // Photos.
  photoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 14,
    backgroundColor: Brand.surfaceAlt,
  },

  // Timeline.
  timeline: {
    paddingTop: 4,
  },
  timelineRow: {
    flexDirection: 'row',
    gap: 14,
  },
  timelineLeft: {
    width: 16,
    alignItems: 'center',
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Brand.primary,
    borderWidth: 3,
    borderColor: Brand.primarySoft,
  },
  dotActive: {
    backgroundColor: Brand.success,
    borderColor: Brand.successSoft,
  },
  line: {
    flex: 1,
    width: 2,
    backgroundColor: Brand.border,
    marginVertical: 2,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 22,
  },
  timelineContentLast: {
    paddingBottom: 0,
  },
  updateLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: Brand.textPrimary,
  },
  updateDate: {
    marginTop: 2,
    fontSize: 13,
    color: Brand.textSecondary,
  },

  // Not found.
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  emptyText: {
    fontSize: 15,
    color: Brand.textMuted,
  },
});
