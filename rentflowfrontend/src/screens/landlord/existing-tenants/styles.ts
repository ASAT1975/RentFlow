import { StyleSheet } from 'react-native';

import { Brand } from '@/constants/brand';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Brand.surface,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 4,
  },
  steps: {
    flexDirection: 'row',
    gap: 6,
  },
  step: {
    width: 22,
    height: 6,
    borderRadius: 3,
    backgroundColor: Brand.border,
  },
  stepActive: {
    backgroundColor: Brand.primary,
  },
  stepCurrent: {
    width: 30,
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

  title: {
    fontSize: 26,
    fontWeight: '800',
    color: Brand.textPrimary,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 15,
    lineHeight: 22,
    color: Brand.textSecondary,
  },

  // Referral code card.
  codeCard: {
    marginTop: 20,
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
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: 2,
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

  // Manual add.
  formCard: {
    marginTop: 22,
    padding: 16,
    borderRadius: 18,
    backgroundColor: Brand.background,
    borderWidth: 1,
    borderColor: Brand.border,
  },
  formTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Brand.textPrimary,
    marginBottom: 4,
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
  },
  flexField: {
    flex: 1,
    marginTop: 12,
  },
  unitField: {
    width: 92,
    marginTop: 12,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 16,
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: Brand.primary,
    backgroundColor: Brand.primarySoft,
  },
  addBtnDisabled: {
    opacity: 0.5,
  },
  addBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: Brand.primary,
  },

  list: {
    marginTop: 18,
    gap: 10,
  },
  personRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    borderRadius: 16,
    backgroundColor: Brand.surface,
    borderWidth: 1,
    borderColor: Brand.border,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Brand.primarySoft,
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '800',
    color: Brand.primary,
  },
  personName: {
    fontSize: 15,
    fontWeight: '700',
    color: Brand.textPrimary,
  },
  personUnit: {
    marginTop: 2,
    fontSize: 13,
    color: Brand.textSecondary,
  },
  removeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Brand.surfaceAlt,
  },

  footer: {
    marginTop: 'auto',
    paddingTop: 24,
    gap: 4,
  },
});
