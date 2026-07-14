import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Brand } from '@/constants/brand';
import { STATUS_META } from '@/constants/maintenance-data';
import { STATUS_LABEL, useMaintenance } from '@/store/maintenance';

import { styles } from './styles';

/**
 * Tenant — Request Details. Opened from a card in Maintenance → My Requests.
 * Shows the full report: status, when it was raised, description, attached
 * photos and a status-update timeline.
 */
export function MaintenanceDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getById } = useMaintenance();
  const request = getById(Number(id));
  const label = request ? STATUS_LABEL[request.status] : 'Open';

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
            <Text style={styles.metaText}>Requested on {request.submittedDate}</Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(120).duration(450)}>
            <Text style={styles.sectionLabel}>Description</Text>
            <View style={styles.block}>
              <Text style={styles.descText}>{request.description}</Text>
            </View>
          </Animated.View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

export default MaintenanceDetailScreen;
