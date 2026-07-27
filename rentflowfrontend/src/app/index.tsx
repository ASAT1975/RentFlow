import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';

import { Brand } from '@/constants/brand';
import { useAuth } from '@/store/auth';
import { useTenant } from '@/store/tenant';

export default function Index() {
  const router = useRouter();
  const { hydrated, isAuthenticated, user } = useAuth();
  const { unit, loading } = useTenant();

  useEffect(() => {
    if (!hydrated) return;

    if (!isAuthenticated || !user) {
      router.replace('/welcome');
      return;
    }

    if (user.role === 'LANDLORD') {
      router.replace('/landlord/(tabs)/dashboard');
      return;
    }

    // TENANT: wait for unit fetch
    if (loading) return;

    router.replace(unit ? '/tenant/(tabs)/dashboard' : '/tenant/referral');
  }, [hydrated, isAuthenticated, user, loading, unit]);

  return <View style={{ flex: 1, backgroundColor: Brand.background }} />;
}
