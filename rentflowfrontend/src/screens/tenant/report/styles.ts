import { StyleSheet } from 'react-native';

import { Brand } from '@/constants/brand';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Brand.background,
  },

  // Sticky-ish header with segmented control.
  headerWrap: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
  },
  heading: {
    fontSize: 26,
    fontWeight: '800',
    color: Brand.textPrimary,
  },
  subheading: {
    marginTop: 3,
    fontSize: 14,
    color: Brand.textSecondary,
  },
  segment: {
    marginTop: 16,
  },

  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
  },

  // Stats row.
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 18,
    backgroundColor: Brand.surface,
    borderWidth: 1,
    borderColor: Brand.border,
  },
  statEmoji: {
    fontSize: 18,
  },
  statValue: {
    marginTop: 6,
    fontSize: 24,
    fontWeight: '800',
  },
  statLabel: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: '600',
    color: Brand.textSecondary,
  },

  // Request list.
  requestCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    marginBottom: 12,
    borderRadius: 18,
    backgroundColor: Brand.surface,
    borderWidth: 1,
    borderColor: Brand.border,
  },
  requestCardPressed: {
    backgroundColor: Brand.surfaceAlt,
  },
  requestEmojiWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Brand.surfaceAlt,
  },
  requestEmoji: {
    fontSize: 22,
  },
  requestTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Brand.textPrimary,
  },
  requestMeta: {
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
  newCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: Brand.primary,
    backgroundColor: Brand.primarySoft,
  },
  newCtaPressed: {
    opacity: 0.9,
  },
  newCtaText: {
    fontSize: 15,
    fontWeight: '800',
    color: Brand.primary,
  },

  // Form labels.
  label: {
    marginTop: 22,
    marginBottom: 10,
    fontSize: 14,
    fontWeight: '700',
    color: Brand.textPrimary,
  },

  // Category chips.
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: Brand.surface,
    borderWidth: 1,
    borderColor: Brand.border,
  },
  chipSelected: {
    backgroundColor: Brand.primary,
    borderColor: Brand.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: Brand.textSecondary,
  },
  chipTextSelected: {
    color: Brand.onPrimary,
  },

  // Title field — has its own top label so add spacing.
  field: {
    marginTop: 22,
  },

  // Description textarea.
  textareaWrap: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Brand.border,
    backgroundColor: Brand.surface,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  textarea: {
    minHeight: 110,
    fontSize: 15,
    color: Brand.textPrimary,
    padding: 0,
  },

  // Priority chips.
  priorities: {
    flexDirection: 'row',
    gap: 10,
  },
  priority: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 46,
    borderRadius: 12,
    backgroundColor: Brand.surface,
    borderWidth: 1.5,
    borderColor: Brand.border,
  },
  priorityEmoji: {
    fontSize: 14,
  },
  priorityText: {
    fontSize: 14,
    fontWeight: '700',
    color: Brand.textSecondary,
  },

  // Photos.
  photoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  photoThumb: {
    width: 76,
    height: 76,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: Brand.surfaceAlt,
  },
  photoImg: {
    width: '100%',
    height: '100%',
  },
  photoRemove: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  addPhoto: {
    width: 76,
    height: 76,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    borderWidth: 1.5,
    borderColor: Brand.primary,
    borderStyle: 'dashed',
    backgroundColor: Brand.primarySoft,
  },
  addPhotoText: {
    fontSize: 12,
    fontWeight: '700',
    color: Brand.primary,
  },

  // Note.
  noteCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginTop: 24,
    padding: 14,
    borderRadius: 14,
    backgroundColor: Brand.primarySoft,
  },
  noteEmoji: {
    fontSize: 18,
  },
  noteText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    color: Brand.primaryPressed,
  },
  submit: {
    marginTop: 24,
  },

  // Success state.
  successWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    paddingHorizontal: 12,
  },
  successBadge: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Brand.successSoft,
  },
  successTitle: {
    marginTop: 22,
    fontSize: 22,
    fontWeight: '800',
    color: Brand.textPrimary,
  },
  successBody: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    color: Brand.textSecondary,
  },
  successButton: {
    marginTop: 28,
    alignSelf: 'stretch',
  },
});
