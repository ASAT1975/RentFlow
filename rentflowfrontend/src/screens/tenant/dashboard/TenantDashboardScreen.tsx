import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

import { Brand } from "@/constants/brand";
import { useTenant } from "@/store/tenant";

export function TenantDashboardScreen() {
  const router = useRouter();
  const { unit, loading } = useTenant();
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setTimedOut(true), 10000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (loading) return;
    if (unit) {
      router.replace("/tenant/(tabs)/dashboard");
    } else {
      router.replace("/tenant/referral");
    }
  }, [loading, unit, router]);

  if (timedOut && loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: Brand.background }}>
        <Text style={{ color: Brand.textSecondary }}>Could not connect. Please check your connection.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: Brand.background }}>
      <ActivityIndicator color={Brand.primary} />
    </View>
  );
}

export default TenantDashboardScreen;
