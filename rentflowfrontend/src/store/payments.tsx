import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { paymentsApi, type Payment, type PaymentStatus } from "@/api";
import { useAuth } from "@/store/auth";
import { usePortfolio } from "@/store/portfolio";

/** A payment in the shape the screens render. */
export type PaymentItem = {
  id: number;
  totalAmount: number;
  amountPaid: number;
  balance: number;
  status: PaymentStatus;
  dueDate: string;
  paidDate?: string | null;
  tenantName?: string;
  propertyName?: string;
};

function toItem(payment: Payment): PaymentItem {
  return {
    id: payment.id,
    totalAmount: payment.totalAmount,
    amountPaid: payment.amountPaid ?? 0,
    balance: payment.balance,
    status: payment.status,
    dueDate: payment.dueDate,
    paidDate: payment.paidDate,
    tenantName: payment.tenant?.name,
    propertyName: payment.property?.name,
  };
}

type PaymentsContextValue = {
  payments: PaymentItem[];
  loading: boolean;
  /** Tenant: total unpaid balance across all dues. */
  outstanding: number;
  /** Landlord: total collected across all property payments. */
  collected: number;
  /** Landlord: total billed across all property payments. */
  expected: number;
  refresh: () => Promise<void>;
  /** Tenant: pay against a specific due. */
  pay: (paymentId: number, amount: number) => Promise<void>;
  /** Landlord: charge rent to a tenant. */
  charge: (
    tenantEmail: string,
    propertyId: number,
    totalAmount: number,
    dueDate: string,
  ) => Promise<void>;
};

const PaymentsContext = createContext<PaymentsContextValue | null>(null);

/**
 * Payments store, role-aware. Tenants load their own dues (`GET /api/payments/my`)
 * and pay them; landlords load payments across their properties for revenue
 * tracking and can charge rent.
 */
export function PaymentsProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  const { properties } = usePortfolio();

  const role = user?.role;
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [loading, setLoading] = useState(false);

  const propertyIds = useMemo(
    () =>
      properties
        .map((p) => p.backendId)
        .filter((id): id is number => typeof id === "number"),
    [properties],
  );

  const refresh = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      if (role === "LANDLORD") {
        const lists = await Promise.all(
          propertyIds.map((id) => paymentsApi.forProperty(id).catch(() => [])),
        );
        setPayments(lists.flat().map(toItem));
      } else if (role === "TENANT") {
        const mine = await paymentsApi.mine();
        setPayments(mine.map(toItem));
      }
    } catch (err) {
      // Keep the previous list on a transient failure.
      console.error("Failed to refresh payments:", err);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, role, propertyIds]);

  useEffect(() => {
    if (isAuthenticated) {
      void refresh();
    } else {
      setPayments([]);
    }
  }, [isAuthenticated, refresh]);

  const pay = useCallback(
    async (paymentId: number, amount: number) => {
      await paymentsApi.pay(paymentId, amount);
      await refresh();
    },
    [refresh],
  );

  const charge = useCallback(
    async (
      tenantEmail: string,
      propertyId: number,
      totalAmount: number,
      dueDate: string,
    ) => {
      await paymentsApi.charge(tenantEmail, propertyId, totalAmount, dueDate);
      await refresh();
    },
    [refresh],
  );

  const outstanding = payments
    .filter((p) => p.status !== "PAID")
    .reduce((sum, p) => sum + Math.max(0, p.balance), 0);
  const collected = payments.reduce((sum, p) => sum + p.amountPaid, 0);
  const expected = payments.reduce((sum, p) => sum + p.totalAmount, 0);

  const value = useMemo<PaymentsContextValue>(
    () => ({
      payments,
      loading,
      outstanding,
      collected,
      expected,
      refresh,
      pay,
      charge,
    }),
    [payments, loading, outstanding, collected, expected, refresh, pay, charge],
  );

  return (
    <PaymentsContext.Provider value={value}>
      {children}
    </PaymentsContext.Provider>
  );
}

export function usePayments() {
  const ctx = useContext(PaymentsContext);
  if (!ctx)
    throw new Error("usePayments must be used within a PaymentsProvider");
  return ctx;
}
