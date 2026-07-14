import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, type StyleProp, StyleSheet, type ViewStyle } from 'react-native';

import { Brand } from '@/constants/brand';

export type BackButtonProps = {
  /** Overrides the default `router.back()` behaviour. */
  onPress?: () => void;
  color?: string;
  style?: StyleProp<ViewStyle>;
};

/** Plain top-left back affordance used on pushed screens. */
export function BackButton({ onPress, color = Brand.textPrimary, style }: BackButtonProps) {
  const router = useRouter();
  return (
    <Pressable
      onPress={onPress ?? (() => router.back())}
      hitSlop={12}
      accessibilityRole="button"
      accessibilityLabel="Go back"
      style={({ pressed }) => [styles.btn, pressed && styles.pressed, style]}>
      <Ionicons name="arrow-back" size={24} color={color} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: 40,
    height: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.6 },
});
