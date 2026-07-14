import { StyleSheet } from 'react-native';

import { Brand } from '@/constants/brand';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Brand.background,
  },

  // Pushed-screen header: back · title · spacer.
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 4,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '800',
    color: Brand.textPrimary,
  },
  headerSpacer: {
    width: 40,
  },

  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 16,
  },

  intro: {
    alignItems: 'center',
  },
  successIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Brand.successSoft,
  },
  title: {
    marginTop: 16,
    fontSize: 24,
    fontWeight: '800',
    color: Brand.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 6,
    fontSize: 15,
    lineHeight: 22,
    color: Brand.textSecondary,
    textAlign: 'center',
  },

  // Referral code card.
  codeCard: {
    marginTop: 22,
    borderRadius: 20,
    padding: 22,
    alignItems: 'center',
    overflow: 'hidden',
  },
  codeLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.85)',
  },
  code: {
    marginTop: 8,
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 3,
    color: Brand.onHero,
  },
  codeActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 18,
  },
  codeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: Brand.onHero,
  },
  codeBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: Brand.primary,
  },

  // Tenant summary.
  tenantCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: 18,
    padding: 14,
    borderRadius: 16,
    backgroundColor: Brand.surface,
    borderWidth: 1,
    borderColor: Brand.border,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Brand.primarySoft,
  },
  avatarText: {
    fontSize: 15,
    fontWeight: '800',
    color: Brand.primary,
  },
  tenantName: {
    fontSize: 15,
    fontWeight: '700',
    color: Brand.textPrimary,
  },
  tenantMeta: {
    marginTop: 2,
    fontSize: 12,
    color: Brand.textSecondary,
  },
  pendingBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: Brand.warningSoft,
  },
  pendingText: {
    fontSize: 11,
    fontWeight: '700',
    color: Brand.warning,
  },

  // How to join.
  sectionTitle: {
    marginTop: 24,
    marginBottom: 12,
    fontSize: 16,
    fontWeight: '800',
    color: Brand.textPrimary,
  },
  stepsCard: {
    padding: 6,
    borderRadius: 16,
    backgroundColor: Brand.surface,
    borderWidth: 1,
    borderColor: Brand.border,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: Brand.border,
  },
  stepLast: {
    borderBottomWidth: 0,
  },
  stepBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Brand.primarySoft,
  },
  stepBadgeText: {
    fontSize: 14,
    fontWeight: '800',
    color: Brand.primary,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: Brand.textPrimary,
  },

  footer: {
    marginTop: 'auto',
    paddingTop: 24,
  },
});
