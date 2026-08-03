import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

import { Brand } from "@/constants/brand";
import { useRouter } from "expo-router";
import { useTenant } from "@/store/tenant";
import { DashboardScreen } from "./DashboardScreen";

export function TenantDashboardScreen() {
  const router = useRouter();
  const { unit, loading } = useTenant();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!unit) {
      router.replace("/tenant/referral");
    } else {
      setReady(true);
    }
  }, [loading, unit, router]);

  if (!ready) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: Brand.background }}>
        <ActivityIndicator color={Brand.primary} />
      </View>
    );
  }

  return <DashboardScreen />;
}

export default TenantDashboardScreen;
