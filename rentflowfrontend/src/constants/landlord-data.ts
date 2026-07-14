import { Brand } from './brand';

/**
 * Shared sample data for the landlord flow. Keeps the landlord screens
 * consistent (John Doe manages the Green Villa / Palm Grove / Lakeside
 * properties, GH₵) until a real backend is wired in.
 */

export const LANDLORD_PROFILE = {
  name: 'John Doe',
  firstName: 'John',
  initials: 'JD',
  role: 'Property Manager',
  email: 'john.doe@greenvilla.com',
  phone: '+233 24 555 0102',
  memberSince: 'Jan 2024',
} as const;

export type RentStatus = 'Paid' | 'Due' | 'Overdue';

export const RENT_STATUS_META: Record<RentStatus, { tint: string; color: string }> = {
  Paid: { tint: Brand.successSoft, color: Brand.success },
  Due: { tint: Brand.warningSoft, color: Brand.warning },
  Overdue: { tint: Brand.dangerSoft, color: Brand.danger },
};

export type LandlordProperty = {
  id: string;
  emoji: string;
  name: string;
  location: string;
  units: number;
  occupied: number;
  revenue: string;
  rating: number;
  /** Backend `Property.id`, present when the row came from the API. */
  backendId?: number;
  /** Property-level invite code from the backend, if any. */
  inviteCode?: string | null;
};

export const PROPERTIES: LandlordProperty[] = [
  { id: 'green-villa', emoji: '🏢', name: 'Green Villa Apartments', location: 'East Legon, Accra', units: 12, occupied: 10, revenue: 'GH₵ 6,000', rating: 4.6 },
  { id: 'palm-grove', emoji: '🏘️', name: 'Palm Grove Residences', location: 'Cantonments, Accra', units: 8, occupied: 8, revenue: 'GH₵ 5,600', rating: 4.8 },
  { id: 'lakeside', emoji: '🏠', name: 'Lakeside Court', location: 'Tema Community 18', units: 6, occupied: 4, revenue: 'GH₵ 2,400', rating: 4.3 },
];

export type LandlordTenant = {
  id: string;
  initials: string;
  name: string;
  property: string;
  unit: string;
  status: RentStatus;
  amount: string;
  /** Backend fields used to charge rent, present for API-sourced tenants. */
  tenantEmail?: string;
  propertyId?: number;
  rentAmount?: number;
};

export const TENANTS: LandlordTenant[] = [
  { id: 'kwame', initials: 'KM', name: 'Kwame Mensah', property: 'Green Villa Apartments', unit: 'A1', status: 'Due', amount: 'GH₵ 600' },
  { id: 'ama', initials: 'AO', name: 'Ama Owusu', property: 'Green Villa Apartments', unit: 'B3', status: 'Paid', amount: 'GH₵ 600' },
  { id: 'yaw', initials: 'YB', name: 'Yaw Boateng', property: 'Palm Grove Residences', unit: 'Unit 2', status: 'Overdue', amount: 'GH₵ 700' },
  { id: 'akosua', initials: 'AD', name: 'Akosua Darko', property: 'Palm Grove Residences', unit: 'Unit 5', status: 'Paid', amount: 'GH₵ 700' },
  { id: 'kofi', initials: 'KA', name: 'Kofi Asante', property: 'Lakeside Court', unit: 'Unit 1', status: 'Paid', amount: 'GH₵ 600' },
  { id: 'efua', initials: 'EM', name: 'Efua Mensah', property: 'Lakeside Court', unit: 'Unit 3', status: 'Due', amount: 'GH₵ 600' },
];

export const LANDLORD_STATS = {
  properties: PROPERTIES.length,
  units: PROPERTIES.reduce((n, p) => n + p.units, 0),
  tenants: PROPERTIES.reduce((n, p) => n + p.occupied, 0),
  occupancyRate: 0.85,
  monthlyRevenue: 'GH₵ 14,000',
  collected: 'GH₵ 11,600',
  outstanding: 'GH₵ 2,400',
  collectionRate: 0.83,
} as const;

export const REVENUE_TREND: { month: string; value: number }[] = [
  { month: 'Jan', value: 12800 },
  { month: 'Feb', value: 13200 },
  { month: 'Mar', value: 13000 },
  { month: 'Apr', value: 13600 },
  { month: 'May', value: 14000 },
  { month: 'Jun', value: 11600 },
];

export type ActivityType = 'payment' | 'maintenance' | 'tenant';

export const LANDLORD_ACTIVITY: { type: ActivityType; emoji: string; title: string; meta: string; time: string }[] = [
  { type: 'payment', emoji: '💰', title: 'Payment received', meta: 'Ama Owusu · GH₵ 600', time: '2h ago' },
  { type: 'maintenance', emoji: '🔧', title: 'New maintenance request', meta: 'Leaky Faucet · Green Villa A1', time: '5h ago' },
  { type: 'tenant', emoji: '👤', title: 'New tenant joined', meta: 'Kofi Asante · Lakeside Court', time: 'Yesterday' },
  { type: 'payment', emoji: '💰', title: 'Payment received', meta: 'Akosua Darko · GH₵ 700', time: 'Yesterday' },
];

/**
 * Maintenance requests awaiting the landlord's attention. `id` links each row to
 * its full request in `maintenance-data.ts` (`getRequest`).
 */
export const PENDING_MAINTENANCE: { id: string; emoji: string; title: string; meta: string; status: 'Open' | 'In Progress' }[] = [
  { id: 'leaky-faucet', emoji: '🚰', title: 'Leaky Faucet', meta: 'Green Villa · Unit A1', status: 'Open' },
  { id: 'broken-window', emoji: '🪟', title: 'Broken Window', meta: 'Palm Grove · Unit 2', status: 'In Progress' },
];
