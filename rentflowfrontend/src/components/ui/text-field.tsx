import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  type StyleProp,
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  Pressable,
  View,
  type ViewStyle,
} from 'react-native';

import { Brand } from '@/constants/brand';

export type TextFieldProps = TextInputProps & {
  /** Label rendered above the field. */
  label?: string;
  /** Leading element (usually an icon). */
  leftIcon?: React.ReactNode;
  /** Trailing element, shown when the field is not a password. */
  rightSlot?: React.ReactNode;
  /** Wrapper style (for layout / spacing). */
  containerStyle?: StyleProp<ViewStyle>;
};

/**
 * Shared labelled text input with focus highlight. When `secureTextEntry` is
 * set it automatically renders an eye toggle to show/hide the value.
 */
export function TextField({
  label,
  leftIcon,
  rightSlot,
  containerStyle,
  secureTextEntry,
  onFocus,
  onBlur,
  style,
  ...inputProps
}: TextFieldProps) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(!!secureTextEntry);

  return (
    <View style={containerStyle}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.field, focused && styles.fieldFocused]}>
        {leftIcon ? <View style={styles.left}>{leftIcon}</View> : null}
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={Brand.textMuted}
          secureTextEntry={hidden}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          {...inputProps}
        />
        {secureTextEntry ? (
          <Pressable
            onPress={() => setHidden((h) => !h)}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={hidden ? 'Show password' : 'Hide password'}>
            <Ionicons
              name={hidden ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={Brand.textMuted}
            />
          </Pressable>
        ) : (
          rightSlot
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Brand.textSecondary,
    marginBottom: 8,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 54,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Brand.border,
    backgroundColor: Brand.surface,
  },
  fieldFocused: {
    borderColor: Brand.primary,
  },
  left: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: Brand.textPrimary,
    padding: 0,
  },
});
