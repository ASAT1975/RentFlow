import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Switch, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/ui/primary-button';
import { Brand } from '@/constants/brand';
import { useAuth } from '@/store/auth';

import { styles } from './styles';

type LinkRowProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  last?: boolean;
  onPress?: () => void;
};

function LinkRow({ icon, label, value, last, onPress }: LinkRowProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [styles.row, last && styles.rowLast, pressed && styles.rowPressed]}>
      <View style={styles.rowIcon}>
        <Ionicons name={icon} size={17} color={Brand.textSecondary} />
      </View>
      <Text style={styles.rowLabel}>{label}</Text>
      {value ? <Text style={styles.rowValue}>{value}</Text> : null}
      <Ionicons name="chevron-forward" size={18} color={Brand.textMuted} />
    </Pressable>
  );
}

type ToggleRowProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
  last?: boolean;
};

function ToggleRow({ icon, label, value, onValueChange, last }: ToggleRowProps) {
  return (
    <View style={[styles.row, last && styles.rowLast]}>
      <View style={styles.rowIcon}>
        <Ionicons name={icon} size={17} color={Brand.textSecondary} />
      </View>
      <Text style={styles.rowLabel}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: Brand.border, true: Brand.primary }}
        thumbColor={Brand.surface}
        ios_backgroundColor={Brand.border}
      />
    </View>
  );
}

/**
 * Landlord — Settings. Opened from the gear on the Profile header. App
 * preferences (language, currency), notification toggles and support links.
 */
const LANGUAGES = ['English', 'French'];
const CURRENCIES = ['GHS (GH₵)', 'NGN (₦)', 'XOF (CFA)'];

export function SettingsScreen() {
  const router = useRouter();
  const { signOut } = useAuth();
  const [paymentAlerts, setPaymentAlerts] = useState(true);
  const [maintenanceRequests, setMaintenanceRequests] = useState(true);
  const [newTenants, setNewTenants] = useState(true);
  const [language, setLanguage] = useState('English');
  const [currency, setCurrency] = useState('GHS (GH₵)');
  const [showLang, setShowLang] = useState(false);
  const [showCurrency, setShowCurrency] = useState(false);

  const logOut = () => {
    signOut();
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.canGoBack() ? router.back() : router.replace('/')}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Back"
          style={styles.iconBtn}>
          <Ionicons name="arrow-back" size={22} color={Brand.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.spacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(450)}>
          <Text style={styles.sectionTitle}>General</Text>
          <View style={styles.card}>
            <LinkRow icon="language-outline" label="Language" value={language} onPress={() => setShowLang(v => !v)} />
            {showLang && (
              <View style={styles.pickerGroup}>
                {LANGUAGES.map((l) => (
                  <Pressable key={l} style={styles.pickerOption} onPress={() => { setLanguage(l); setShowLang(false); }}>
                    <Text style={[styles.pickerOptionText, l === language && styles.pickerOptionActive]}>{l}</Text>
                    {l === language && <Ionicons name="checkmark" size={16} color={Brand.primary} />}
                  </Pressable>
                ))}
              </View>
            )}
            <LinkRow icon="cash-outline" label="Currency" value={currency} onPress={() => setShowCurrency(v => !v)} last={!showCurrency} />
            {showCurrency && (
              <View style={[styles.pickerGroup, styles.rowLast]}>
                {CURRENCIES.map((c) => (
                  <Pressable key={c} style={styles.pickerOption} onPress={() => { setCurrency(c); setShowCurrency(false); }}>
                    <Text style={[styles.pickerOptionText, c === currency && styles.pickerOptionActive]}>{c}</Text>
                    {c === currency && <Ionicons name="checkmark" size={16} color={Brand.primary} />}
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(80).duration(450)}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.card}>
            <ToggleRow
              icon="cash-outline"
              label="Payment Alerts"
              value={paymentAlerts}
              onValueChange={setPaymentAlerts}
            />
            <ToggleRow
              icon="construct-outline"
              label="Maintenance Requests"
              value={maintenanceRequests}
              onValueChange={setMaintenanceRequests}
            />
            <ToggleRow
              icon="person-add-outline"
              label="New Tenant Sign-ups"
              value={newTenants}
              onValueChange={setNewTenants}
              last
            />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(160).duration(450)} style={styles.signOut}>
          <PrimaryButton
            label="Log Out"
            variant="outline"
            leading={<Ionicons name="log-out-outline" size={20} color={Brand.danger} />}
            onPress={logOut}
          />
        </Animated.View>

        <Text style={styles.version}>RentFlow v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

export default SettingsScreen;
