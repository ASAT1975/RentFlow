import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ApiError, type Role } from '@/api';
import { Brand } from '@/constants/brand';
import { useAuth } from '@/store/auth';

import { styles } from './styles';

type RoleCardProps = {
  icon: React.ReactNode;
  accent: string;
  accentSoft: string;
  title: string;
  description: string;
  onPress: () => void;
};

function RoleCard({ icon, accent, accentSoft, title, description, onPress }: RoleCardProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
      <View style={styles.cardTopRow}>
        <View style={[styles.iconTile, { backgroundColor: accentSoft }]}>{icon}</View>
        <View style={[styles.arrowBtn, { backgroundColor: accent }]}>
          <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
        </View>
      </View>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardDesc}>{description}</Text>
    </Pressable>
  );
}

/**
 * Choose Role screen — the fork between the tenant and landlord journeys.
 * Tenant → enter a referral code; Landlord → set up their first property.
 */
export function ChooseRoleScreen() {
  const router = useRouter();
  const { completeSignup } = useAuth();
  const [submitting, setSubmitting] = useState<Role | null>(null);

  const chooseRole = async (role: Role) => {
    if (submitting) return;
    setSubmitting(role);
    try {
      await completeSignup(role);
      router.replace(role === 'LANDLORD' ? '/landlord/setup' : '/tenant/referral');
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : 'Could not create your account. Please try again.';
      Alert.alert('Sign-up failed', message, [
        { text: 'Go back', onPress: () => router.replace('/login') },
      ]);
    } finally {
      setSubmitting(null);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(500)}>
          <Text style={styles.title}>Choose Your Role</Text>
          <Text style={styles.subtitle}>Select how you want to use RentFlow</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(120).duration(500)}>
          <RoleCard
            icon={<Ionicons name="person" size={26} color={Brand.primary} />}
            accent={Brand.primary}
            accentSoft={Brand.primarySoft}
            title="I am a Tenant"
            description="Join your landlord's property using a referral code"
            onPress={() => chooseRole('TENANT')}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(220).duration(500)}>
          <RoleCard
            icon={<MaterialCommunityIcons name="office-building" size={26} color={Brand.success} />}
            accent={Brand.success}
            accentSoft={Brand.successSoft}
            title="I am a Landlord"
            description="Manage your properties, tenants and payments"
            onPress={() => chooseRole('LANDLORD')}
          />
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default ChooseRoleScreen;
