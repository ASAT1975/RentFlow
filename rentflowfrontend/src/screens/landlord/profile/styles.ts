import { StyleSheet } from 'react-native';

import { Brand } from '@/constants/brand';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Brand.background,
  },

  // Tab header: title · settings gear.
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: Brand.textPrimary,
  },
  gearBtn: {
    width: 40,
    height: 40,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Brand.surface,
    borderWidth: 1,
    borderColor: Brand.border,
  },

  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 32,
  },

  // Profile header.
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  avatarWrap: {
    width: 88,
    height: 88,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Brand.primarySoft,
  },
  avatarText: {
    fontSize: 30,
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
    fontSize: 21,
    fontWeight: '800',
    color: Brand.textPrimary,
  },
  roleBadge: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: Brand.primarySoft,
  },
  roleText: {
    fontSize: 13,
    fontWeight: '700',
    color: Brand.primary,
  },
  email: {
    marginTop: 10,
    fontSize: 14,
    color: Brand.textSecondary,
  },
  phone: {
    marginTop: 2,
    fontSize: 14,
    color: Brand.textSecondary,
  },

  // Portfolio summary (3-up).
  portfolioCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 22,
    paddingVertical: 18,
    borderRadius: 18,
    backgroundColor: Brand.surface,
    borderWidth: 1,
    borderColor: Brand.border,
  },
  portfolioItem: {
    flex: 1,
    alignItems: 'center',
  },
  portfolioValue: {
    fontSize: 20,
    fontWeight: '800',
    color: Brand.textPrimary,
  },
  portfolioLabel: {
    marginTop: 3,
    fontSize: 12,
    color: Brand.textSecondary,
  },
  portfolioDivider: {
    width: 1,
    alignSelf: 'stretch',
    marginVertical: 4,
    backgroundColor: Brand.border,
  },

  // Sections + cards.
  sectionTitle: {
    marginTop: 26,
    marginBottom: 12,
    fontSize: 14,
    fontWeight: '800',
    color: Brand.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  card: {
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
    width: 34,
    height: 34,
    borderRadius: 11,
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

  // Account link rows.
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Brand.border,
  },
  linkRowLast: {
    borderBottomWidth: 0,
  },
  linkRowPressed: {
    opacity: 0.6,
  },
  linkIcon: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Brand.surfaceAlt,
  },
  linkLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: Brand.textPrimary,
  },

  signOut: {
    marginTop: 28,
  },
});
