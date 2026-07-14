import { StyleSheet } from 'react-native';

import { Brand } from '@/constants/brand';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Brand.surface,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 4,
    paddingBottom: 8,
  },

  // Found / success header.
  successBadge: {
    alignSelf: 'center',
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Brand.successSoft,
    marginTop: 12,
  },
  title: {
    marginTop: 18,
    fontSize: 24,
    fontWeight: '800',
    color: Brand.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 26,
    fontSize: 15,
    lineHeight: 22,
    color: Brand.textSecondary,
    textAlign: 'center',
  },

  // Property card.
  card: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Brand.border,
    backgroundColor: Brand.surface,
    overflow: 'hidden',
    shadowColor: '#1B1F33',
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  photo: {
    width: '100%',
    height: 170,
    backgroundColor: Brand.surfaceAlt,
  },
  cardBody: {
    padding: 18,
  },
  propertyName: {
    fontSize: 17,
    fontWeight: '800',
    color: Brand.textPrimary,
  },
  propertyAddress: {
    marginTop: 2,
    fontSize: 14,
    color: Brand.textSecondary,
  },

  divider: {
    height: 1,
    backgroundColor: Brand.border,
    marginVertical: 16,
  },

  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  detailLabelWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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
    fontSize: 14,
    color: Brand.textSecondary,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '700',
    color: Brand.textPrimary,
  },

  // Footer actions.
  footer: {
    marginTop: 'auto',
    paddingBottom: 8,
    gap: 12,
  },
});