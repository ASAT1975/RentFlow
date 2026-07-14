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
    paddingTop: 8,
    paddingBottom: 32,
  },

  // Floating settings button (top-right).
  settingsBtn: {
    position: 'absolute',
    top: 6,
    right: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Brand.surface,
    borderWidth: 1,
    borderColor: Brand.border,
  },

  // Profile header.
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  avatarWrap: {
    width: 84,
    height: 84,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Brand.primarySoft,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '800',
    color: Brand.primary,
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Brand.primary,
    borderWidth: 2,
    borderColor: Brand.background,
  },
  name: {
    marginTop: 14,
    fontSize: 20,
    fontWeight: '800',
    color: Brand.textPrimary,
  },
  email: {
    marginTop: 2,
    fontSize: 14,
    color: Brand.textSecondary,
  },
  phone: {
    marginTop: 2,
    fontSize: 14,
    color: Brand.textSecondary,
  },

  // Section + card.
  sectionTitle: {
    marginTop: 26,
    marginBottom: 4,
    fontSize: 16,
    fontWeight: '800',
    color: Brand.textPrimary,
  },
  card: {
    marginTop: 12,
    borderRadius: 18,
    backgroundColor: Brand.surface,
    borderWidth: 1,
    borderColor: Brand.border,
    paddingHorizontal: 16,
  },

  // Detail rows.
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: Brand.border,
  },
  detailRowLast: {
    borderBottomWidth: 0,
  },
  detailIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Brand.surfaceAlt,
  },
  detailLabel: {
    flex: 1,
    fontSize: 14,
    color: Brand.textSecondary,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '700',
    color: Brand.textPrimary,
  },

  // Apartment card.
  apartmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 16,
  },
  apartmentThumb: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: Brand.surfaceAlt,
  },
  apartmentName: {
    fontSize: 16,
    fontWeight: '800',
    color: Brand.textPrimary,
  },
  apartmentAddress: {
    marginTop: 2,
    fontSize: 13,
    color: Brand.textSecondary,
  },
  cardDivider: {
    height: 1,
    backgroundColor: Brand.border,
  },

  // Help / Rate CTA cards.
  helpCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: 12,
    padding: 16,
    borderRadius: 18,
    backgroundColor: Brand.surface,
    borderWidth: 1,
    borderColor: Brand.border,
  },
  ctaPressed: {
    backgroundColor: Brand.surfaceAlt,
  },
  ctaIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Brand.textPrimary,
  },
  ctaSubtitle: {
    marginTop: 2,
    fontSize: 13,
    color: Brand.textSecondary,
  },

  // Submitted review preview.
  reviewedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  editLink: {
    fontSize: 14,
    fontWeight: '700',
    color: Brand.primary,
  },
  reviewText: {
    marginTop: -4,
    paddingBottom: 16,
    fontSize: 14,
    lineHeight: 20,
    fontStyle: 'italic',
    color: Brand.textSecondary,
  },

  starsRow: {
    flexDirection: 'row',
    gap: 8,
  },

  signOut: {
    marginTop: 28,
  },

  // Modal shared (bottom sheet).
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15,18,40,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Brand.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 14,
    paddingBottom: 32,
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: Brand.border,
  },
  sheetClose: {
    position: 'absolute',
    top: 16,
    right: 18,
  },
  sheetTitle: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: '800',
    color: Brand.textPrimary,
    textAlign: 'center',
  },
  sheetSubtitle: {
    marginTop: 6,
    fontSize: 14,
    color: Brand.textSecondary,
    textAlign: 'center',
  },
  sheetStars: {
    alignItems: 'center',
    marginTop: 22,
  },
  reviewInput: {
    marginTop: 22,
    marginBottom: 20,
    minHeight: 110,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Brand.border,
    backgroundColor: Brand.background,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: Brand.textPrimary,
  },

  // Contact landlord modal.
  landlordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: 20,
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
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: 16,
    padding: 14,
    borderRadius: 14,
    backgroundColor: Brand.background,
    borderWidth: 1,
    borderColor: Brand.border,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactLabel: {
    fontSize: 12,
    color: Brand.textSecondary,
  },
  contactValue: {
    marginTop: 1,
    fontSize: 14,
    fontWeight: '700',
    color: Brand.textPrimary,
  },
  contactAction: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
  },
  contactActionText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
