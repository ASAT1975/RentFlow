import { useRouter } from "expo-router";
import { useEffect } from "react";

/**
 * This is a placeholder for the tenant dashboard. It currently just redirects
 * to the notifications screen, which serves as the main hub for tenants.
 */
export function TenantDashboardScreen() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/tenant/notifications");
  }, [router]);
  return null;
}

export default TenantDashboardScreen;
