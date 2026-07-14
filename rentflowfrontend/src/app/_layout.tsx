import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, useColorScheme } from 'react-native';

import { Brand } from '@/constants/brand';
import { SplashScreen } from '@/screens/splash';
import { AuthProvider } from '@/store/auth';
import { MaintenanceProvider } from '@/store/maintenance';
import { PaymentsProvider } from '@/store/payments';
import { PortfolioProvider } from '@/store/portfolio';
import { TenantProvider } from '@/store/tenant';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [splashVisible, setSplashVisible] = useState(true);

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
                    onAnimationFinish={() => setSplashVisible(false)}
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
