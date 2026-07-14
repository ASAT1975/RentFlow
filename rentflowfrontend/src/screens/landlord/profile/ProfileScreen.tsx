import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/ui/primary-button';
import { Brand } from '@/constants/brand';
import { useAuth } from '@/store/auth';
import { usePortfolio } from '@/store/portfolio';

import { styles } from './styles';

function initialsOf(name?: string) {
  return (
    (name ?? '')
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? '')
      .join('') || '👤'
  );
}

type DetailRowProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  last?: boolean;
};

function DetailRow({ icon, label, value, last }: DetailRowProps) {
  return (
    <View style={[styles.detailRow, last && styles.detailRowLast]}>
      <View style={styles.detailIcon}>
        <Ionicons name={icon} size={16} color={Brand.textSecondary} />
      </View>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

type LinkRowProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress?: () => void;
  last?: boolean;
};

function LinkRow({ icon, label, onPress, last }: LinkRowProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.linkRow,
        last && styles.linkRowLast,
        pressed && styles.linkRowPressed,
      ]}>
      <View style={styles.linkIcon}>
        <Ionicons name={icon} size={17} color={Brand.textSecondary} />
      </View>
      <Text style={styles.linkLabel}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color={Brand.textMuted} />
    </Pressable>
  );
}

/**
 * Landlord — Profile. A bottom-nav tab (also reachable from the dashboard
 * avatar). Shows the landlord's personal details and a portfolio snapshot, with
 * a settings gear (top-right) that opens the app settings.
 */
export function ProfileScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { summary } = usePortfolio();

  const name = user?.name ?? 'Landlord';
  const email = user?.email ?? '—';

  const logOut = () => {
    signOut();
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Profile</Text>
        <Pressable
          onPress={() => router.push('/landlord/settings')}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Settings"
          style={styles.gearBtn}>
          <Ionicons name="settings-outline" size={20} color={Brand.textPrimary} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Profile header */}
        <Animated.View entering={FadeInDown.duration(450)} style={styles.profileHeader}>
          <View style={styles.avatarWrap}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initialsOf(name)}</Text>
            </View>
            <View style={styles.editBadge}>
              <Ionicons name="camera" size={13} color={Brand.onPrimary} />
            </View>
          </View>
          <Text style={styles.name}>{name}</Text>
          <View style={styles.roleBadge}>
            <Ionicons name="briefcase" size={12} color={Brand.primary} />
            <Text style={styles.roleText}>Landlord</Text>
          </View>
          <Text style={styles.email}>{email}</Text>
        </Animated.View>

        {/* Portfolio snapshot */}
        <Animated.View entering={FadeInDown.delay(80).duration(500)} style={styles.portfolioCard}>
          <View style={styles.portfolioItem}>
            <Text style={styles.portfolioValue}>{summary.properties}</Text>
            <Text style={styles.portfolioLabel}>Properties</Text>
          </View>
          <View style={styles.portfolioDivider} />
          <View style={styles.portfolioItem}>
            <Text style={styles.portfolioValue}>{summary.units}</Text>
            <Text style={styles.portfolioLabel}>Units</Text>
          </View>
          <View style={styles.portfolioDivider} />
          <View style={styles.portfolioItem}>
            <Text style={styles.portfolioValue}>{summary.tenants}</Text>
            <Text style={styles.portfolioLabel}>Tenants</Text>
          </View>
        </Animated.View>

        {/* Personal information */}
        <Animated.View entering={FadeInDown.delay(140).duration(500)}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <View style={styles.card}>
            <DetailRow icon="person-outline" label="Full Name" value={name} />
            <DetailRow icon="mail-outline" label="Email Address" value={email} last />
          </View>
        </Animated.View>

        {/* Account */}
        <Animated.View entering={FadeInDown.delay(200).duration(500)}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.card}>
            <LinkRow icon="create-outline" label="Edit Profile" />
            <LinkRow icon="card-outline" label="Payout Account" />
            <LinkRow
              icon="settings-outline"
              label="App Settings"
              onPress={() => router.push('/landlord/settings')}
            />
            <LinkRow icon="help-circle-outline" label="Help & Support" last />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(260).duration(500)} style={styles.signOut}>
          <PrimaryButton
            label="Log Out"
            variant="outline"
            leading={<Ionicons name="log-out-outline" size={20} color={Brand.danger} />}
            onPress={logOut}
          />
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default ProfileScreen;
