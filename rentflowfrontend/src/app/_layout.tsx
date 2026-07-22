import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, useColorScheme } from 'react-native';

import { API_BASE_URL } from '@/api';
import { Brand } from '@/constants/brand';
import { SplashScreen } from '@/screens/splash';
import { AuthProvider } from '@/store/auth';
import { MaintenanceProvider } from '@/store/maintenance';
import { PaymentsProvider } from '@/store/payments';
import { PortfolioProvider } from '@/store/portfolio';
import { TenantProvider } from '@/store/tenant';

async function waitForBackend(maxWaitMs = 55000): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < maxWaitMs) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/health`, { signal: AbortSignal.timeout(5000) });
      if (res.ok) return;
    } catch {
      // still waking — wait and retry
    }
    await new Promise((r) => setTimeout(r, 3000));
  }
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [splashVisible, setSplashVisible] = useState(true);
  const [backendReady, setBackendReady] = useState(false);
  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => {
    waitForBackend().finally(() => setBackendReady(true));
  }, []);

  // Dismiss splash only when BOTH the animation has finished AND the backend is ready.
  useEffect(() => {
    if (splashDone && backendReady) setSplashVisible(false);
  }, [splashDone, backendReady]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <PortfolioProvider>
          <TenantProvider>
            <MaintenanceProvider>
              <PaymentsProvider>
                <Stack
                  screenOptions={{
                    headerShown: false,
                    animation: 'slide_from_right',
                    contentStyle: { backgroundColor: Brand.background },
                  }}
                />
                {splashVisible && (
                  <SplashScreen
                    onAnimationFinish={() => setSplashDone(true)}
                    style={styles.overlay}
                  />
                )}
              </PaymentsProvider>
            </MaintenanceProvider>
          </TenantProvider>
        </PortfolioProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  // Float the splash above the navigator until its exit animation finishes.
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    elevation: 1000,
  },
});
