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

  // Property card.
  card: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Brand.border,
    backgroundColor: Brand.surface,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: 180,
    backgroundColor: Brand.surfaceAlt,
  },
  cardBody: {
    padding: 18,
  },
  propertyName: {
    fontSize: 18,
    fontWeight: '800',
    color: Brand.textPrimary,
  },
  propertyAddress: {
    marginTop: 2,
    fontSize: 14,
    color: Brand.textSecondary,
  },
  description: {
    marginTop: 12,
    fontSize: 14,
    lineHeight: 21,
    color: Brand.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: Brand.border,
    marginVertical: 16,
  },

  // Detail rows.
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: Brand.border,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  rowIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Brand.surfaceAlt,
  },
  rowLabel: {
    flex: 1,
    fontSize: 14,
    color: Brand.textSecondary,
  },
  rowValue: {
    fontSize: 14,
    fontWeight: '700',
    color: Brand.textPrimary,
  },

  lease: {
    marginTop: 14,
  },

  // Sections.
  sectionTitle: {
    marginTop: 26,
    marginBottom: 12,
    fontSize: 16,
    fontWeight: '800',
    color: Brand.textPrimary,
  },

  // Landlord rating card.
  landlordCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    borderRadius: 18,
    backgroundColor: Brand.surface,
    borderWidth: 1,
    borderColor: Brand.border,
  },
  landlordAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Brand.primarySoft,
  },
  landlordInitials: {
    fontSize: 17,
    fontWeight: '800',
    color: Brand.primary,
  },
  landlordName: {
    fontSize: 16,
    fontWeight: '800',
    color: Brand.textPrimary,
  },
  landlordRole: {
    marginTop: 2,
    fontSize: 13,
    color: Brand.textSecondary,
  },
  ratingBox: {
    alignItems: 'flex-end',
    gap: 3,
  },
  ratingScore: {
    fontSize: 20,
    fontWeight: '800',
    color: Brand.textPrimary,
  },
  ratingCount: {
    fontSize: 12,
    color: Brand.textMuted,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
  },

  // Review cards.
  reviewCard: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 16,
    backgroundColor: Brand.surface,
    borderWidth: 1,
    borderColor: Brand.border,
  },
  reviewTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  reviewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Brand.surfaceAlt,
  },
  reviewInitials: {
    fontSize: 14,
    fontWeight: '800',
    color: Brand.textSecondary,
  },
  reviewName: {
    fontSize: 14,
    fontWeight: '800',
    color: Brand.textPrimary,
    marginBottom: 3,
  },
  reviewText: {
    fontSize: 14,
    lineHeight: 20,
    fontStyle: 'italic',
    color: Brand.textSecondary,
  },

  // Other properties.
  otherCard: {
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
  otherCardPressed: {
    backgroundColor: Brand.surfaceAlt,
  },
  otherThumb: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Brand.primarySoft,
  },
  otherName: {
    fontSize: 15,
    fontWeight: '800',
    color: Brand.textPrimary,
  },
  otherLocation: {
    marginTop: 2,
    fontSize: 13,
    color: Brand.textSecondary,
  },
  otherRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  otherScore: {
    fontSize: 14,
    fontWeight: '800',
    color: Brand.textPrimary,
  },
  otherReviews: {
    fontSize: 12,
    color: Brand.textMuted,
  },
});
