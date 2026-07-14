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

  // Add form.
  formCard: {
    marginTop: 18,
    padding: 16,
    borderRadius: 18,
    backgroundColor: Brand.background,
    borderWidth: 1,
    borderColor: Brand.border,
  },
  field: {
    marginTop: 0,
  },
  label: {
    marginTop: 16,
    marginBottom: 10,
    fontSize: 13,
    fontWeight: '600',
    color: Brand.textSecondary,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: Brand.surface,
    borderWidth: 1,
    borderColor: Brand.border,
  },
  chipOn: {
    backgroundColor: Brand.primary,
    borderColor: Brand.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: Brand.textSecondary,
  },
  chipTextOn: {
    color: Brand.onPrimary,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 6,
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

  // Added list.
  listHeading: {
    marginTop: 24,
    marginBottom: 12,
    fontSize: 14,
    fontWeight: '800',
    color: Brand.textPrimary,
  },
  roomCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    marginBottom: 10,
    borderRadius: 16,
    backgroundColor: Brand.surface,
    borderWidth: 1,
    borderColor: Brand.border,
  },
  roomIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Brand.primarySoft,
  },
  roomName: {
    fontSize: 15,
    fontWeight: '700',
    color: Brand.textPrimary,
  },
  roomMeta: {
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
  },
});
