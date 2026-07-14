import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { maintenanceApi, type MaintenanceRequest, type MaintenanceStatus } from '@/api';
import { useAuth } from '@/store/auth';
import { usePortfolio } from '@/store/portfolio';
import { useTenant } from '@/store/tenant';

/** A maintenance request in a shape the screens render. */
export type MaintenanceItem = {
  id: number;
  title: string;
  description: string;
  status: MaintenanceStatus;
  submittedDate: string;
  /** Landlord-side attribution (present on the per-property listing). */
  propertyName?: string;
  tenantName?: string;
};

/** Backend status → the label the UI shows. */
export type MaintenanceLabel = 'Open' | 'In Progress' | 'Completed';

export const STATUS_LABEL: Record<MaintenanceStatus, MaintenanceLabel> = {
  PENDING: 'Open',
  IN_PROGRESS: 'In Progress',
  RESOLVED: 'Completed',
};

function toItem(request: MaintenanceRequest): MaintenanceItem {
  return {
    id: request.id,
    title: request.title,
    description: request.description,
    status: request.status,
    submittedDate: request.submittedDate,
    propertyName: request.property?.name,
    tenantName: request.tenant?.name,
  };
}

type MaintenanceContextValue = {
  requests: MaintenanceItem[];
  loading: boolean;
  refresh: () => Promise<void>;
  getById: (id: number) => MaintenanceItem | undefined;
  /** Tenant: submit a new request against their property. */
  submit: (title: string, description: string) => Promise<void>;
  /** Landlord: advance a request's status. */
  updateStatus: (id: number, status: MaintenanceStatus) => Promise<void>;
};

const MaintenanceContext = createContext<MaintenanceContextValue | null>(null);

/**
 * Maintenance store, role-aware. Landlords see requests aggregated across their
 * properties (`GET /api/maintenance/property/{id}`); tenants see their own
 * (`GET /api/maintenance/my`) and can submit new ones.
 */
export function MaintenanceProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  const { properties } = usePortfolio();
  const { unit } = useTenant();

  const role = user?.role;
  const [requests, setRequests] = useState<MaintenanceItem[]>([]);
  const [loading, setLoading] = useState(false);

  const propertyIds = properties
    .map((p) => p.backendId)
    .filter((id): id is number => typeof id === 'number');
  const propertyIdsKey = propertyIds.join(',');

  const refresh = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      if (role === 'LANDLORD') {
        const lists = await Promise.all(
          propertyIds.map((id) => maintenanceApi.forProperty(id).catch(() => [])),
        );
        setRequests(lists.flat().map(toItem));
      } else if (role === 'TENANT') {
        const mine = await maintenanceApi.mine();
        setRequests(mine.map(toItem));
      }
    } catch {
      // Leave the previous list in place on a transient failure.
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, role, propertyIdsKey]);

  useEffect(() => {
    if (isAuthenticated) {
      void refresh();
    } else {
      setRequests([]);
    }
  }, [isAuthenticated, refresh]);

  const submit = useCallback(
    async (title: string, description: string) => {
      if (!unit) throw new Error('You have not joined a property yet.');
      await maintenanceApi.submit(unit.propertyId, title.trim(), description.trim());
      await refresh();
    },
    [unit, refresh],
  );

  const updateStatus = useCallback(
    async (id: number, status: MaintenanceStatus) => {
      await maintenanceApi.updateStatus(id, status);
      await refresh();
    },
    [refresh],
  );

  const getById = useCallback(
    (id: number) => requests.find((r) => r.id === id),
    [requests],
  );

  const value = useMemo<MaintenanceContextValue>(
    () => ({ requests, loading, refresh, getById, submit, updateStatus }),
    [requests, loading, refresh, getById, submit, updateStatus],
  );

  return <MaintenanceContext.Provider value={value}>{children}</MaintenanceContext.Provider>;
}

export function useMaintenance() {
  const ctx = useContext(MaintenanceContext);
  if (!ctx) throw new Error('useMaintenance must be used within a MaintenanceProvider');
  return ctx;
}
