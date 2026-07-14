/**
 * Shared sample data for the tenant flow. Mirrors the design mockup (Green Villa
 * Apartments, Kwame Mensah, Accra, GH₵) so every tenant screen stays consistent
 * until a real backend is wired in.
 */

export const TENANT = {
  name: 'Kwame Mensah',
  firstName: 'Kwame',
  initials: 'KM',
  email: 'kwame.mensah@email.com',
  phone: '+233 24 123 4567',
  emergencyContact: '+233 20 987 6543',
} as const;

export const PROPERTY = {
  name: 'Green Villa Apartments',
  address: 'East Legon, Accra',
  room: 'A1',
  monthlyRent: 'GH₵ 600.00',
  description:
    'A modern and secure apartment complex with 24/7 security, water supply, and ample parking space.',
  leaseStart: '15 Dec, 2024',
  leaseEnd: '15 Dec, 2025',
} as const;

export const LANDLORD = {
  name: 'John Doe',
  phone: '+233 24 555 0102',
  email: 'john.doe@greenvilla.com',
} as const;

export const RENT = {
  outstanding: 'GH₵ 600.00',
  nextDueLong: '15th June, 2025',
  nextDueShort: '15 Jun, 2025',
  daysRemaining: '5 days remaining',
} as const;

/** Shared house photo the tenant uploaded during verification. */
export const PROPERTY_PHOTO = require('../../assets/images/property-sunset.png');
