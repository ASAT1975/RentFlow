import { useRouter } from "expo-router";
import { useEffect } from "react";

import { useTenant } from "@/store/tenant";

export function TenantDashboardScreen() {
  const router = useRouter();
  const { unit, loading } = useTenant();

  useEffect(() => {
    if (loading) return;
    if (unit) {
      router.replace("/tenant/(tabs)/dashboard");
    } else {
      router.replace("/tenant/referral");
    }
  }, [loading, unit, router]);

  return null;
}

export default TenantDashboardScreen;
