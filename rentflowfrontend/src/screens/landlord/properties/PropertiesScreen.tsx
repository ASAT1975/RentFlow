import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Brand } from '@/constants/brand';
import { usePortfolio } from '@/store/portfolio';

import { styles } from './styles';

/**
 * Landlord — Properties. Every property in the portfolio with its occupancy
 * and monthly revenue at a glance.
 */
export function PropertiesScreen() {
  const router = useRouter();
  const { properties, loading, refresh } = usePortfolio();

  const totalUnits = properties.reduce((n, p) => n + p.units, 0);
  const totalOccupied = properties.reduce((n, p) => n + p.occupied, 0);
  const occupancyPct = totalUnits ? Math.round((totalOccupied / totalUnits) * 100) : 0;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Properties</Text>
        <Pressable
          style={styles.addBtn}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Add property"
          onPress={() => router.push('/landlord/add-property')}>
          <Ionicons name="add" size={22} color={Brand.onPrimary} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refresh} tintColor={Brand.primary} />
        }>
        <Animated.View entering={FadeInDown.duration(450)} style={styles.summary}>
          <Summary value={String(properties.length)} label="Properties" />
          <View style={styles.summaryDivider} />
          <Summary value={String(totalUnits)} label="Total Units" />
          <View style={styles.summaryDivider} />
          <Summary value={`${occupancyPct}%`} label="Occupied" />
        </Animated.View>

        {properties.length === 0 ? (
          <View style={styles.empty}>
            {loading ? (
              <ActivityIndicator color={Brand.primary} />
            ) : (
              <>
                <Ionicons name="business-outline" size={40} color={Brand.textMuted} />
                <Text style={styles.emptyTitle}>No properties yet</Text>
                <Text style={styles.emptyBody}>
                  Tap the + button to add your first property and start inviting tenants.
                </Text>
              </>
            )}
          </View>
        ) : null}

        {properties.map((p, i) => {
          const pct = p.units ? Math.round((p.occupied / p.units) * 100) : 0;
          return (
            <Animated.View key={p.id} entering={FadeInDown.delay(80 + i * 70).duration(450)}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={p.name}
                style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
                <View style={styles.cardTop}>
                  <View style={styles.emojiTile}>
                    <Text style={styles.emoji}>{p.emoji}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.name}>{p.name}</Text>
                    <Text style={styles.location}>{p.location}</Text>
                  </View>
                  <View style={styles.rating}>
                    <Ionicons name="star" size={13} color={Brand.warning} />
                    <Text style={styles.ratingText}>{p.rating}</Text>
                  </View>
                </View>

                <View style={styles.occRow}>
                  <Text style={styles.occLabel}>
                    {p.occupied}/{p.units} units occupied
                  </Text>
                  <Text style={styles.occPct}>{pct}%</Text>
                </View>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      { width: `${pct}%`, backgroundColor: pct === 100 ? Brand.success : Brand.primary },
                    ]}
                  />
                </View>

                <View style={styles.revenueRow}>
                  <Text style={styles.revenueLabel}>Monthly revenue</Text>
                  <Text style={styles.revenueValue}>{p.revenue}</Text>
                </View>
              </Pressable>
            </Animated.View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

function Summary({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.summaryItem}>
      <Text style={styles.summaryValue}>{value}</Text>
      <Text style={styles.summaryLabel}>{label}</Text>
    </View>
  );
}

export default PropertiesScreen;
