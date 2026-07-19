import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { unitsApi, type UnitStatus, type UnitSummary } from "@/api";
import { ApiError } from "@/api/client";
import { useAuth } from "@/store/auth";

/** The tenant's rented unit, normalized across the join / "my unit" responses. */
export type TenantUnit = {
  unitNumber: string;
  property: string;
  propertyId: number;
  rentAmount: number;
  status: UnitStatus;
};

function normalize(summary: UnitSummary): TenantUnit {
  return {
    unitNumber: summary.unitNumber ?? summary.unit ?? "—",
    property: summary.property,
    propertyId: summary.propertyId,
    rentAmount: summary.rentAmount,
    status: summary.status ?? "OCCUPIED",
  };
}

type TenantContextValue = {
  unit: TenantUnit | null;
  loading: boolean;
  hasJoined: boolean;
  refresh: () => Promise<void>;
  joinUnit: (inviteCode: string) => Promise<TenantUnit>;
  /**
   * Start Paystack card authorization for automatic rent collection. Returns the
   * URL the tenant should open to complete authorization.
   */
  authorizePayment: (rentDueDay: number) => Promise<string>;
};

const TenantContext = createContext<TenantContextValue | null>(null);

/**
 * Tenant data store. Loads the signed-in tenant's unit (`GET /api/units/my`)
 * once authenticated, and exposes `joinUnit` for the referral-code flow. A fresh
 * tenant has no unit until they join, so a failed lookup simply means "not
 * joined yet" rather than an error.
 */
export function TenantProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  const isTenant = user?.role === "TENANT";

  const [unit, setUnit] = useState<TenantUnit | null>(null);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!isAuthenticated || !isTenant) return;
    setLoading(true);
    try {
      const mine = await unitsApi.mine();
      setUnit(normalize(mine));
    } catch (err) {
      // A 404 means the tenant has no unit joined yet. Other errors are unexpected.
      if (err instanceof ApiError && err.status === 404) {
        setUnit(null);
      } else {
        console.error("Failed to refresh tenant unit:", err);
      }
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, isTenant]);

  useEffect(() => {
    if (isAuthenticated && isTenant) {
      void refresh();
    } else {
      setUnit(null);
    }
  }, [isAuthenticated, isTenant, refresh]);

  const joinUnit = useCallback(
    async (inviteCode: string): Promise<TenantUnit> => {
      const joined = normalize(await unitsApi.join(inviteCode.trim()));
      setUnit(joined);
      return joined;
    },
    [],
  );

  const authorizePayment = useCallback(
    async (rentDueDay: number): Promise<string> => {
      const res = await unitsApi.authorizePayment(rentDueDay);
      return res.authorizationUrl;
    },
    [],
  );

  const value = useMemo<TenantContextValue>(
    () => ({
      unit,
      loading,
      hasJoined: unit != null,
      refresh,
      joinUnit,
      authorizePayment,
    }),
    [unit, loading, refresh, joinUnit, authorizePayment],
  );

  return (
    <TenantContext.Provider value={value}>{children}</TenantContext.Provider>
  );
}

export function useTenant() {
  const ctx = useContext(TenantContext);
  if (!ctx) throw new Error("useTenant must be used within a TenantProvider");
  return ctx;
}
