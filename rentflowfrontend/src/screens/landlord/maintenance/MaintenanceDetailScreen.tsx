import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ApiError, type MaintenanceStatus } from '@/api';
import { PrimaryButton } from '@/components/ui/primary-button';
import { Brand } from '@/constants/brand';
import { STATUS_META } from '@/constants/maintenance-data';
import { initialsOf } from '@/lib/format';
import { STATUS_LABEL, useMaintenance } from '@/store/maintenance';

import { styles } from './styles';

/** The single forward step a landlord can take from each status. */
const NEXT_STEP: Record<MaintenanceStatus, { label: string; next: MaintenanceStatus } | null> = {
  PENDING: { label: 'Start Work', next: 'IN_PROGRESS' },
  IN_PROGRESS: { label: 'Mark as Completed', next: 'RESOLVED' },
  RESOLVED: null,
};

/**
 * Landlord — Maintenance Request detail. Opened from the dashboard's "Needs
 * Attention" list. Shows who reported the issue and lets the landlord advance it
 * through Open → In Progress → Completed against the backend.
 */
export function MaintenanceDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getById, updateStatus } = useMaintenance();
  const [updating, setUpdating] = useState(false);

  const request = getById(Number(id));
  const label = request ? STATUS_LABEL[request.status] : 'Open';
  const step = request ? NEXT_STEP[request.status] : null;

  const advance = async () => {
    if (!request || !step || updating) return;
    setUpdating(true);
    try {
      await updateStatus(request.id, step.next);
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : 'Could not update the request. Please try again.';
      Alert.alert('Update failed', message);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Back"
          style={styles.iconBtn}>
          <Ionicons name="arrow-back" size={22} color={Brand.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Request Details</Text>
        <View style={styles.spacer} />
      </View>

      {!request ? (
        <View style={styles.empty}>
          <Ionicons name="document-outline" size={36} color={Brand.textMuted} />
          <Text style={styles.emptyText}>Request not found</Text>
        </View>
      ) : (
        <>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}>
            <Animated.View entering={FadeInDown.duration(450)} style={styles.titleCard}>
              <View style={styles.emojiTile}>
                <Text style={styles.emoji}>🔧</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{request.title}</Text>
                <Text style={styles.category}>Maintenance</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: STATUS_META[label].tint }]}>
                <Text style={[styles.statusText, { color: STATUS_META[label].color }]}>{label}</Text>
              </View>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(60).duration(450)} style={styles.metaRow}>
              <Ionicons name="time-outline" size={16} color={Brand.textSecondary} />
              <Text style={styles.metaText}>Reported on {request.submittedDate}</Text>
            </Animated.View>

            {request.tenantName ? (
              <Animated.View entering={FadeInDown.delay(120).duration(450)}>
                <Text style={styles.sectionLabel}>Reported By</Text>
                <View style={styles.reporterCard}>
                  <View style={styles.reporterAvatar}>
                    <Text style={styles.reporterInitials}>{initialsOf(request.tenantName)}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.reporterName}>{request.tenantName}</Text>
                    {request.propertyName ? (
                      <Text style={styles.reporterSub}>{request.propertyName}</Text>
                    ) : null}
                  </View>
                </View>
              </Animated.View>
            ) : null}

            <Animated.View entering={FadeInDown.delay(180).duration(450)}>
              <Text style={styles.sectionLabel}>Description</Text>
              <View style={styles.block}>
                <Text style={styles.descText}>{request.description}</Text>
              </View>
            </Animated.View>
          </ScrollView>

          <View style={styles.footer}>
            {step ? (
              <PrimaryButton
                label={updating ? 'Updating…' : step.label}
                onPress={advance}
                disabled={updating}
                leading={
                  <Ionicons
                    name={
                      request.status === 'PENDING' ? 'construct-outline' : 'checkmark-circle-outline'
                    }
                    size={20}
                    color={Brand.onPrimary}
                  />
                }
              />
            ) : (
              <View style={styles.resolvedBanner}>
                <Ionicons name="checkmark-circle" size={20} color={Brand.success} />
                <Text style={styles.resolvedText}>This request has been resolved</Text>
              </View>
            )}
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

export default MaintenanceDetailScreen;
