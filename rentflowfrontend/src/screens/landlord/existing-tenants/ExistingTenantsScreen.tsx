import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, Layout } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BackButton } from '@/components/ui/back-button';
import { PrimaryButton } from '@/components/ui/primary-button';
import { TextField } from '@/components/ui/text-field';
import { Brand } from '@/constants/brand';
import { usePortfolio } from '@/store/portfolio';

import { styles } from './styles';

type Person = { id: string; name: string; unit: string };

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

/**
 * Landlord — Add Existing Tenants (setup step 3, final). Share the property
 * referral code or add current tenants manually, then finish onboarding.
 */
export function ExistingTenantsScreen() {
  const router = useRouter();
  const { setupProperty, refresh } = usePortfolio();
  const [copied, setCopied] = useState(false);
  const [people, setPeople] = useState<Person[]>([]);
  const [name, setName] = useState('');
  const [unit, setUnit] = useState('');

  const referralCode = setupProperty?.inviteCode ?? '—';
  const canAdd = name.trim().length > 0 && unit.trim().length > 0;
  const finish = () => {
    void refresh();
    router.replace('/landlord/dashboard');
  };

  const addPerson = () => {
    if (!canAdd) return;
    setPeople((prev) => [...prev, { id: String(Date.now()), name: name.trim(), unit: unit.trim() }]);
    setName('');
    setUnit('');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.headerRow}>
        <BackButton />
        <View style={styles.steps}>
          {[0, 1, 2].map((i) => (
            <View key={i} style={[styles.step, styles.stepActive, i === 2 && styles.stepCurrent]} />
          ))}
        </View>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeIn.duration(400)}>
          <Text style={styles.title}>Add Existing Tenants</Text>
          <Text style={styles.subtitle}>
            Share your referral code so current tenants can join, or add them manually.
          </Text>
        </Animated.View>

        {/* Referral code */}
        <Animated.View entering={FadeInDown.delay(80).duration(500)}>
          <LinearGradient
            colors={[Brand.heroTop, Brand.heroMid, Brand.heroBottom]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.codeCard}>
            <Text style={styles.codeLabel}>Property Referral Code</Text>
            <Text style={styles.code}>{referralCode}</Text>
            <View style={styles.codeActions}>
              <Pressable
                onPress={() => setCopied(true)}
                accessibilityRole="button"
                style={styles.codeBtn}>
                <Ionicons
                  name={copied ? 'checkmark' : 'copy-outline'}
                  size={16}
                  color={Brand.primary}
                />
                <Text style={styles.codeBtnText}>{copied ? 'Copied' : 'Copy'}</Text>
              </Pressable>
              <Pressable accessibilityRole="button" style={styles.codeBtn}>
                <Ionicons name="share-social-outline" size={16} color={Brand.primary} />
                <Text style={styles.codeBtnText}>Share</Text>
              </Pressable>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Manual add */}
        <Animated.View entering={FadeInDown.delay(140).duration(500)} style={styles.formCard}>
          <Text style={styles.formTitle}>Add a tenant manually</Text>
          <View style={styles.formRow}>
            <TextField
              label="Tenant Name"
              value={name}
              onChangeText={setName}
              placeholder="e.g. Adwoa Mensah"
              containerStyle={styles.flexField}
            />
            <TextField
              label="Unit"
              value={unit}
              onChangeText={setUnit}
              placeholder="B3"
              containerStyle={styles.unitField}
            />
          </View>
          <Pressable
            onPress={addPerson}
            disabled={!canAdd}
            accessibilityRole="button"
            style={[styles.addBtn, !canAdd && styles.addBtnDisabled]}>
            <Ionicons name="person-add-outline" size={17} color={Brand.primary} />
            <Text style={styles.addBtnText}>Add Tenant</Text>
          </Pressable>
        </Animated.View>

        {people.length > 0 ? (
          <View style={styles.list}>
            {people.map((p) => (
              <Animated.View
                key={p.id}
                entering={FadeInDown.duration(350)}
                layout={Layout.springify()}
                style={styles.personRow}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{initials(p.name)}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.personName}>{p.name}</Text>
                  <Text style={styles.personUnit}>Unit {p.unit}</Text>
                </View>
                <Pressable
                  onPress={() => setPeople((prev) => prev.filter((x) => x.id !== p.id))}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel={`Remove ${p.name}`}
                  style={styles.removeBtn}>
                  <Ionicons name="close" size={16} color={Brand.textSecondary} />
                </Pressable>
              </Animated.View>
            ))}
          </View>
        ) : null}

        <View style={styles.footer}>
          <PrimaryButton label="Finish Setup" onPress={finish} />
          <PrimaryButton label="Skip for now" variant="ghost" onPress={finish} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default ExistingTenantsScreen;
