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

  sectionTitle: {
    marginTop: 22,
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

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Brand.border,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  rowPressed: {
    opacity: 0.6,
  },
  rowIcon: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Brand.surfaceAlt,
  },
  rowLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: Brand.textPrimary,
  },
  rowValue: {
    fontSize: 14,
    color: Brand.textSecondary,
  },

  signOut: {
    marginTop: 28,
  },
  version: {
    marginTop: 20,
    fontSize: 12,
    color: Brand.textMuted,
    textAlign: 'center',
  },
});
