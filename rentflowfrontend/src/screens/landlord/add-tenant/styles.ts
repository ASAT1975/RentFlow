import { StyleSheet } from 'react-native';

import { Brand } from '@/constants/brand';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Brand.surface,
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

  heroIcon: {
    width: 60,
    height: 60,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Brand.primarySoft,
  },
  title: {
    marginTop: 18,
    fontSize: 26,
    fontWeight: '800',
    color: Brand.textPrimary,
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 8,
    fontSize: 15,
    lineHeight: 22,
    color: Brand.textSecondary,
  },

  field: {
    marginTop: 18,
  },
  label: {
    marginTop: 20,
    marginBottom: 10,
    fontSize: 13,
    fontWeight: '600',
    color: Brand.textSecondary,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
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
    fontSize: 14,
    fontWeight: '600',
    color: Brand.textSecondary,
  },
  chipTextOn: {
    color: Brand.onPrimary,
  },

  row: {
    flexDirection: 'row',
    gap: 12,
  },
  rowField: {
    flex: 1,
    marginTop: 18,
  },

  footer: {
    marginTop: 'auto',
    paddingTop: 24,
  },
});
