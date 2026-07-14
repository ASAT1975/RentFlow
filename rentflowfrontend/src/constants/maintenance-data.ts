import type { ImageSourcePropType } from 'react-native';

import { Brand } from './brand';
import { PROPERTY_PHOTO } from './tenant-data';

export type MaintenanceStatus = 'Open' | 'In Progress' | 'Completed';

export type StatusUpdate = {
  date: string;
  label: string;
};

export type MaintenanceRequest = {
  id: string;
  emoji: string;
  title: string;
  category: string;
  location: string;
  date: string;
  time: string;
  status: MaintenanceStatus;
  priority: string;
  description: string;
  photos: ImageSourcePropType[];
  updates: StatusUpdate[];
  /** Landlord-side attribution — who reported it and from which unit. */
  property?: string;
  unit?: string;
  tenantName?: string;
  tenantInitials?: string;
  tenantPhone?: string;
};

/** Colour tokens per status, shared by the list badges and the detail header. */
export const STATUS_META: Record<MaintenanceStatus, { tint: string; color: string }> = {
  Open: { tint: Brand.primarySoft, color: Brand.primary },
  'In Progress': { tint: Brand.warningSoft, color: Brand.warning },
  Completed: { tint: Brand.successSoft, color: Brand.success },
};

export const MAINTENANCE_REQUESTS: MaintenanceRequest[] = [
  {
    id: 'leaky-faucet',
    emoji: '🚰',
    title: 'Leaky Faucet',
    category: 'Plumbing',
    location: 'Bathroom',
    date: '10 May, 2025',
    time: '10:30 AM',
    status: 'Open',
    priority: 'Medium',
    description: 'The kitchen sink faucet is leaking water continuously.',
    photos: [PROPERTY_PHOTO, PROPERTY_PHOTO],
    updates: [
      { date: '10 May, 2025 · 10:30 AM', label: 'Request Submitted' },
      { date: '10 May, 2025 · 02:15 PM', label: 'Request Received' },
    ],
    property: 'Green Villa Apartments',
    unit: 'Unit A1',
    tenantName: 'Kwame Mensah',
    tenantInitials: 'KM',
    tenantPhone: '+233 20 123 4567',
  },
  {
    id: 'broken-window',
    emoji: '🪟',
    title: 'Broken Window',
    category: 'Structural',
    location: 'Living Room',
    date: '5 May, 2025',
    time: '4:05 PM',
    status: 'In Progress',
    priority: 'High',
    description: 'A window pane in the living room is cracked and needs replacement.',
    photos: [],
    updates: [
      { date: '5 May, 2025 · 04:05 PM', label: 'Request Submitted' },
      { date: '5 May, 2025 · 05:30 PM', label: 'Request Received' },
      { date: '6 May, 2025 · 09:00 AM', label: 'Work In Progress' },
    ],
    property: 'Palm Grove Residences',
    unit: 'Unit 2',
    tenantName: 'Yaw Boateng',
    tenantInitials: 'YB',
    tenantPhone: '+233 24 987 6543',
  },
  {
    id: 'ac-not-cooling',
    emoji: '❄️',
    title: 'AC Not Cooling',
    category: 'Heating / AC',
    location: 'Bedroom',
    date: '28 Apr, 2025',
    time: '11:20 AM',
    status: 'Completed',
    priority: 'Medium',
    description: 'The bedroom air conditioner runs but no longer cools the room.',
    photos: [],
    updates: [
      { date: '28 Apr, 2025 · 11:20 AM', label: 'Request Submitted' },
      { date: '28 Apr, 2025 · 01:00 PM', label: 'Request Received' },
      { date: '29 Apr, 2025 · 10:00 AM', label: 'Work In Progress' },
      { date: '30 Apr, 2025 · 03:45 PM', label: 'Completed' },
    ],
    property: 'Green Villa Apartments',
    unit: 'Unit A1',
    tenantName: 'Kwame Mensah',
    tenantInitials: 'KM',
    tenantPhone: '+233 20 123 4567',
  },
];

export function getRequest(id?: string) {
  return MAINTENANCE_REQUESTS.find((r) => r.id === id);
}
