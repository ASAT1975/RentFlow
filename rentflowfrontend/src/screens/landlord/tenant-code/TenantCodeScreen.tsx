import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Share, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BackButton } from '@/components/ui/back-button';
import { PrimaryButton } from '@/components/ui/primary-button';
import { Brand } from '@/constants/brand';

import { styles } from './styles';

/** Build a fresh `RF-XXXXXX` referral code (no ambiguous 0/O/1/I). */
function makeCode() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let body = '';
  for (let i = 0; i < 6; i += 1) {
    body += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `RF-${body}`;
}

function initials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? '')
      .join('') || '?'
  );
}

/**
 * Landlord — Tenant Referral Code. Reached after adding a tenant. Generates a
 * one-off referral code the tenant enters to join the property, with copy /
 * share affordances and join instructions.
 */
export function TenantCodeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ name?: string; property?: string; unit?: string }>();
  const name = params.name?.trim() || 'your tenant';
  const property = params.property?.trim() || 'your property';
  const unit = params.unit?.trim();
  const firstName = name.split(/\s+/)[0];

  // Generated once when the screen mounts so it stays stable across re-renders.
  const [code] = useState(makeCode);
  const [copied, setCopied] = useState(false);

  const shareMessage = `Hi ${firstName}! Join ${property} on RentFlow with my referral code: ${code}`;

  const onShare = () => {
    Share.share({ message: shareMessage }).catch(() => {});
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.headerTitle}>Referral Code</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeIn.duration(400)} style={styles.intro}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark" size={30} color={Brand.success} />
          </View>
          <Text style={styles.title}>Code Generated 🎉</Text>
          <Text style={styles.subtitle}>
            Share this code with {firstName} so they can join {property}
            {unit ? ` · Unit ${unit}` : ''}.
          </Text>
        </Animated.View>

        {/* Code card */}
        <Animated.View entering={FadeInDown.delay(80).duration(500)}>
          <LinearGradient
            colors={[Brand.heroTop, Brand.heroMid, Brand.heroBottom]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.codeCard}>
            <Text style={styles.codeLabel}>Referral Code</Text>
            <Text style={styles.code}>{code}</Text>
            <View style={styles.codeActions}>
              <Pressable
                onPress={() => setCopied(true)}
                accessibilityRole="button"
                accessibilityLabel="Copy code"
                style={styles.codeBtn}>
                <Ionicons
                  name={copied ? 'checkmark' : 'copy-outline'}
                  size={16}
                  color={Brand.primary}
                />
                <Text style={styles.codeBtnText}>{copied ? 'Copied' : 'Copy'}</Text>
              </Pressable>
              <Pressable
                onPress={onShare}
                accessibilityRole="button"
                accessibilityLabel="Share code"
                style={styles.codeBtn}>
                <Ionicons name="share-social-outline" size={16} color={Brand.primary} />
                <Text style={styles.codeBtnText}>Share</Text>
              </Pressable>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Tenant summary */}
        <Animated.View entering={FadeInDown.delay(140).duration(500)} style={styles.tenantCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials(name)}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.tenantName}>{name}</Text>
            <Text style={styles.tenantMeta}>
              {property}
              {unit ? ` · Unit ${unit}` : ''}
            </Text>
          </View>
          <View style={styles.pendingBadge}>
            <Text style={styles.pendingText}>Invited</Text>
          </View>
        </Animated.View>

        {/* How to join */}
        <Animated.View entering={FadeInDown.delay(200).duration(500)}>
          <Text style={styles.sectionTitle}>How {firstName} joins</Text>
          <View style={styles.stepsCard}>
            <Step n={1} text="Download RentFlow and sign up" />
            <Step n={2} text="Choose “I'm a Tenant” on the role screen" />
            <Step n={3} text={`Enter this referral code: ${code}`} last />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(260).duration(500)} style={styles.footer}>
          <PrimaryButton label="Done" onPress={() => router.navigate('/landlord/tenants')} />
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Step({ n, text, last }: { n: number; text: string; last?: boolean }) {
  return (
    <View style={[styles.step, last && styles.stepLast]}>
      <View style={styles.stepBadge}>
        <Text style={styles.stepBadgeText}>{n}</Text>
      </View>
      <Text style={styles.stepText}>{text}</Text>
    </View>
  );
}

export default TenantCodeScreen;
