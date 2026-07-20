import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { propertiesApi, unitsApi, type Property, type Unit } from '@/api';
import { type LandlordProperty, type LandlordTenant } from '@/constants/landlord-data';
import { useAuth } from '@/store/auth';

function slugify(value: string) {
  return (
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'item'
  );
}

function initials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? '')
      .join('') || '?'
  );
}

/** "GH₵ 6,000" → 6000 */
function parseAmount(value: string) {
  const n = parseInt(value.replace(/[^0-9]/g, ''), 10);
  return Number.isFinite(n) ? n : 0;
}

/** 6600 → "GH₵ 6,600" (manual grouping; Hermes has no full Intl). */
function formatGhs(n: number) {
  return `GH₵ ${n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
}

/** Map a backend property + its units into the shape the landlord UI renders. */
function toLandlordProperty(property: Property, units: Unit[]): LandlordProperty {
  const occupiedUnits = units.filter((u) => u.status === 'OCCUPIED');
  const revenue = occupiedUnits.reduce((sum, u) => sum + (u.rentAmount ?? 0), 0);
  return {
    id: String(property.id),
    backendId: property.id,
    inviteCode: property.inviteCode,
    emoji: '🏢',
    name: property.name,
    location: property.address,
    units: units.length,
    occupied: occupiedUnits.length,
    revenue: formatGhs(revenue),
    rating: 5.0,
  };
}

/** Build a tenant row from an occupied unit that has a tenant attached. */
function toLandlordTenant(property: Property, unit: Unit): LandlordTenant {
  const name = unit.tenant?.name ?? 'Tenant';
  return {
    id: `unit-${unit.id}`,
    initials: initials(name),
    name,
    property: property.name,
    unit: unit.unitNumber,
    // Rent status comes from the payments feed (wired later); default to Due.
    status: 'Due',
    amount: formatGhs(unit.rentAmount ?? 0),
    tenantEmail: unit.tenant?.email,
    propertyId: property.id,
    rentAmount: unit.rentAmount ?? 0,
  };
}

export type PortfolioSummary = {
  properties: number;
  units: number;
  tenants: number;
  occupancyRate: number;
  /** Expected monthly rent across occupied units, formatted (e.g. "GH₵ 6,000"). */
  monthlyRevenue: string;
};

const EMPTY_SUMMARY: PortfolioSummary = {
  properties: 0,
  units: 0,
  tenants: 0,
  occupancyRate: 0,
  monthlyRevenue: formatGhs(0),
};

export type NewPropertyInput = {
  name: string;
  location: string;
  type: string | null;
  units: string;
  rent: string;
};

export type NewRoomInput = {
  name: string;
  type: string;
  rent: string;
};

export type NewTenantInput = {
  name: string;
  property: string;
  unit: string;
  rent: string;
};

/** The property created during onboarding, handed between the setup screens. */
export type SetupProperty = {
  id: number;
  name: string;
  inviteCode: string;
};

type PortfolioContextValue = {
  properties: LandlordProperty[];
  tenants: LandlordTenant[];
  summary: PortfolioSummary;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  /** Property being built in the onboarding wizard (setup → rooms → invite). */
  setupProperty: SetupProperty | null;
  createProperty: (input: NewPropertyInput) => Promise<SetupProperty>;
  createUnit: (input: NewRoomInput) => Promise<Unit>;
  addTenant: (input: NewTenantInput) => void;
};

const PortfolioContext = createContext<PortfolioContextValue | null>(null);

/**
 * Landlord portfolio store, backed by the RentFlow API. Loads the landlord's
 * properties (with their units aggregated for occupancy/revenue) once they're
 * authenticated, and exposes create operations used by the onboarding wizard and
 * the Add Property screen.
 *
 * `tenants` is still seeded from sample data — the tenants list aggregates unit
 * occupants and is wired to the backend in a later step.
 */
export function PortfolioProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  const isLandlord = user?.role === 'LANDLORD';

  const [properties, setProperties] = useState<LandlordProperty[]>([]);
  const [tenants, setTenants] = useState<LandlordTenant[]>([]);
  const [summary, setSummary] = useState<PortfolioSummary>(EMPTY_SUMMARY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [setupProperty, setSetupProperty] = useState<SetupProperty | null>(null);

  const refresh = useCallback(async () => {
    if (!isAuthenticated || !isLandlord) return;
    setLoading(true);
    setError(null);
    try {
      const list = await propertiesApi.mine();
      const withUnits = await Promise.all(
        list.map(async (property) => {
          let units: Unit[] = [];
          try {
            units = await unitsApi.forProperty(property.id);
          } catch {
            // Non-fatal: show the property with zero units if the lookup fails.
          }
          return { property, units };
        }),
      );

      const mappedProperties = withUnits.map(({ property, units }) =>
        toLandlordProperty(property, units),
      );
      const mappedTenants = withUnits.flatMap(({ property, units }) =>
        units
          .filter((u) => u.status === 'OCCUPIED' && u.tenant)
          .map((u) => toLandlordTenant(property, u)),
      );

      const totalUnits = mappedProperties.reduce((n, p) => n + p.units, 0);
      const totalOccupied = mappedProperties.reduce((n, p) => n + p.occupied, 0);
      const monthlyRevenue = withUnits.reduce(
        (sum, { units }) =>
          sum +
          units
            .filter((u) => u.status === 'OCCUPIED')
            .reduce((s, u) => s + (u.rentAmount ?? 0), 0),
        0,
      );

      setProperties(mappedProperties);
      setTenants(mappedTenants);
      setSummary({
        properties: mappedProperties.length,
        units: totalUnits,
        tenants: totalOccupied,
        occupancyRate: totalUnits ? totalOccupied / totalUnits : 0,
        monthlyRevenue: formatGhs(monthlyRevenue),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load properties');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, isLandlord]);

  // Load (or clear) the portfolio as the auth session changes.
  useEffect(() => {
    if (isAuthenticated && isLandlord) {
      void refresh();
    } else {
      setProperties([]);
      setTenants([]);
      setSummary(EMPTY_SUMMARY);
      setSetupProperty(null);
    }
  }, [isAuthenticated, isLandlord, refresh]);

  const createProperty = useCallback(
    async (input: NewPropertyInput): Promise<SetupProperty> => {
      const created = await propertiesApi.create(
        input.name.trim(),
        input.location.trim(),
        parseAmount(input.rent),
      );
      const setup: SetupProperty = {
        id: created.id,
        name: created.name,
        inviteCode: created.inviteCode,
      };
      setSetupProperty(setup);
      void refresh();
      return setup;
    },
    [refresh],
  );

  const createUnit = useCallback(
    async (input: NewRoomInput): Promise<Unit> => {
      if (!setupProperty) {
        throw new Error('No property selected. Please set up a property first.');
      }
      const unit = await unitsApi.create(
        setupProperty.id,
        input.name.trim(),
        input.type,
        parseAmount(input.rent),
      );
      void refresh();
      return unit;
    },
    [refresh, setupProperty],
  );

  const addTenant = useCallback((input: NewTenantInput) => {
    // Local-only for now; backend tenant assignment happens via unit invite
    // codes (wired in the tenant flow step).
    const tenant: LandlordTenant = {
      id: `${slugify(input.name)}-${Date.now()}`,
      initials: initials(input.name),
      name: input.name.trim(),
      property: input.property,
      unit: input.unit.trim(),
      status: 'Due',
      amount: formatGhs(parseAmount(input.rent)),
    };
    setTenants((prev) => [tenant, ...prev]);
  }, []);

  const value = useMemo<PortfolioContextValue>(
    () => ({
      properties,
      tenants,
      summary,
      loading,
      error,
      refresh,
      setupProperty,
      createProperty,
      createUnit,
      addTenant,
    }),
    [
      properties,
      tenants,
      summary,
      loading,
      error,
      refresh,
      setupProperty,
      createProperty,
      createUnit,
      addTenant,
    ],
  );

  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>;
}

export function usePortfolio() {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error('usePortfolio must be used within a PortfolioProvider');
  return ctx;
}
