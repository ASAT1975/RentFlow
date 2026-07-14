import {
  ActivityIndicator,
  Pressable,
  type StyleProp,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from 'react-native';

import { Brand } from '@/constants/brand';

export type PrimaryButtonProps = {
  label: string;
  onPress?: () => void;
  /**
   * `primary` = solid indigo, `secondary` = soft indigo, `outline` = white with
   * border, `ghost` = transparent.
   */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  loading?: boolean;
  disabled?: boolean;
  /** Optional leading element (e.g. an icon). */
  leading?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

/** Shared full-width call-to-action button used across the app. */
export function PrimaryButton({
  label,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  leading,
  style,
}: PrimaryButtonProps) {
  const isPrimary = variant === 'primary';
  const isGhost = variant === 'ghost';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      style={({ pressed }) => [
        styles.base,
        isPrimary && styles.primary,
        variant === 'secondary' && styles.secondary,
        variant === 'outline' && styles.outline,
        isGhost && styles.ghost,
        pressed && !disabled && styles.pressed,
        (disabled || loading) && styles.disabled,
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={isPrimary ? Brand.onPrimary : Brand.primary} />
      ) : (
        <View style={styles.content}>
          {leading}
          <Text
            style={[
              styles.label,
              isPrimary && styles.labelOnPrimary,
              variant === 'outline' && styles.labelOnOutline,
              (variant === 'secondary' || isGhost) && styles.labelOnSoft,
            ]}
            numberOfLines={1}>
            {label}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 54,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  primary: { backgroundColor: Brand.primary },
  secondary: { backgroundColor: Brand.primarySoft },
  outline: { backgroundColor: Brand.surface, borderWidth: 1, borderColor: Brand.border },
  ghost: { backgroundColor: 'transparent' },
  pressed: { opacity: 0.92, transform: [{ scale: 0.99 }] },
  disabled: { opacity: 0.5 },
  content: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  label: { fontSize: 16, fontWeight: '700' },
  labelOnPrimary: { color: Brand.onPrimary },
  labelOnSoft: { color: Brand.primary },
  labelOnOutline: { color: Brand.textPrimary },
});
