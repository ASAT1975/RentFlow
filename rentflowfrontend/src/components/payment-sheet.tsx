import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { ApiError } from '@/api';
import { PrimaryButton } from '@/components/ui/primary-button';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { TextField } from '@/components/ui/text-field';
import { Brand } from '@/constants/brand';

type Method = 'momo' | 'bank';

const NETWORKS = ['MTN', 'Vodafone', 'AirtelTigo'] as const;

export type PaymentSheetProps = {
  visible: boolean;
  amount: string;
  onClose: () => void;
  /** Called when the tenant confirms. Record the payment against the backend. */
  onPay?: () => Promise<void>;
};

/**
 * Bottom-sheet payment popup. The tenant chooses how to pay — Mobile Money or
 * Bank — fills in the matching details and confirms. Ends on a success state.
 */
export function PaymentSheet({ visible, amount, onClose, onPay }: PaymentSheetProps) {
  const [method, setMethod] = useState<Method>('momo');
  const [network, setNetwork] = useState<(typeof NETWORKS)[number]>('MTN');
  const [momoNumber, setMomoNumber] = useState('');
  const [momoName, setMomoName] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [paid, setPaid] = useState(false);
  const [paying, setPaying] = useState(false);

  const momoValid = momoNumber.trim().length >= 9 && momoName.trim().length > 0;
  const bankValid =
    bankName.trim().length > 0 && accountNumber.trim().length >= 6 && accountName.trim().length > 0;
  const canPay = method === 'momo' ? momoValid : bankValid;

  const confirmPay = async () => {
    if (!canPay || paying) return;
    setPaying(true);
    try {
      await onPay?.();
      setPaid(true);
    } catch (err) {
      Alert.alert(
        'Payment failed',
        err instanceof ApiError ? err.message : 'Could not record your payment. Please try again.',
      );
    } finally {
      setPaying(false);
    }
  };

  const close = () => {
    setPaid(false);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={close}>
      <Pressable style={styles.backdrop} onPress={close}>
        <Animated.View entering={FadeInUp.duration(260)}>
          <Pressable style={styles.sheet} onPress={() => {}}>
            <View style={styles.handle} />
            <Pressable
              onPress={close}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Close"
              style={styles.close}>
              <Ionicons name="close" size={22} color={Brand.textSecondary} />
            </Pressable>

            {paid ? (
              <View style={styles.successWrap}>
                <View style={styles.successBadge}>
                  <Ionicons name="checkmark-circle" size={52} color={Brand.success} />
                </View>
                <Text style={styles.successTitle}>Payment Successful 🎉</Text>
                <Text style={styles.successBody}>
                  Your payment of {amount} was received. A receipt has been added to your account.
                </Text>
                <View style={styles.successBtn}>
                  <PrimaryButton label="Done" onPress={close} />
                </View>
              </View>
            ) : (
              <>
                <Text style={styles.title}>Pay Rent</Text>
                <View style={styles.amountPill}>
                  <Text style={styles.amountLabel}>Amount Due</Text>
                  <Text style={styles.amountValue}>{amount}</Text>
                </View>

                <SegmentedControl<Method>
                  options={[
                    { key: 'momo', label: '📱 Mobile Money' },
                    { key: 'bank', label: '🏦 Bank' },
                  ]}
                  value={method}
                  onChange={setMethod}
                  style={styles.segment}
                />

                {method === 'momo' ? (
                  <View>
                    <Text style={styles.fieldLabel}>Mobile Network</Text>
                    <View style={styles.networks}>
                      {NETWORKS.map((n) => {
                        const on = n === network;
                        return (
                          <Pressable
                            key={n}
                            onPress={() => setNetwork(n)}
                            style={[styles.network, on && styles.networkOn]}>
                            <Text style={[styles.networkText, on && styles.networkTextOn]}>{n}</Text>
                          </Pressable>
                        );
                      })}
                    </View>
                    <TextField
                      label="Mobile Money Number"
                      value={momoNumber}
                      onChangeText={setMomoNumber}
                      placeholder="024 123 4567"
                      keyboardType="phone-pad"
                      containerStyle={styles.field}
                    />
                    <TextField
                      label="Account Name"
                      value={momoName}
                      onChangeText={setMomoName}
                      placeholder="Kwame Mensah"
                      containerStyle={styles.field}
                    />
                  </View>
                ) : (
                  <View>
                    <TextField
                      label="Bank Name"
                      value={bankName}
                      onChangeText={setBankName}
                      placeholder="e.g. GCB Bank"
                      containerStyle={styles.field}
                    />
                    <TextField
                      label="Account Number"
                      value={accountNumber}
                      onChangeText={setAccountNumber}
                      placeholder="1234567890"
                      keyboardType="number-pad"
                      containerStyle={styles.field}
                    />
                    <TextField
                      label="Account Name"
                      value={accountName}
                      onChangeText={setAccountName}
                      placeholder="Kwame Mensah"
                      containerStyle={styles.field}
                    />
                  </View>
                )}

                <View style={styles.payBtn}>
                  <PrimaryButton
                    label={paying ? 'Processing…' : `Pay ${amount}`}
                    disabled={!canPay || paying}
                    onPress={confirmPay}
                  />
                </View>
                <View style={styles.secureRow}>
                  <Ionicons name="lock-closed" size={13} color={Brand.textMuted} />
                  <Text style={styles.secureText}>Payments are secured & encrypted</Text>
                </View>
              </>
            )}
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15,18,40,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Brand.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 14,
    paddingBottom: 32,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: Brand.border,
  },
  close: {
    position: 'absolute',
    top: 16,
    right: 18,
  },
  title: {
    marginTop: 8,
    fontSize: 20,
    fontWeight: '800',
    color: Brand.textPrimary,
    textAlign: 'center',
  },
  amountPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: Brand.primarySoft,
  },
  amountLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Brand.primary,
  },
  amountValue: {
    fontSize: 20,
    fontWeight: '800',
    color: Brand.primary,
  },
  segment: {
    marginTop: 18,
  },
  fieldLabel: {
    marginTop: 18,
    marginBottom: 10,
    fontSize: 13,
    fontWeight: '600',
    color: Brand.textSecondary,
  },
  networks: {
    flexDirection: 'row',
    gap: 10,
  },
  network: {
    flex: 1,
    height: 42,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Brand.surface,
    borderWidth: 1,
    borderColor: Brand.border,
  },
  networkOn: {
    backgroundColor: Brand.primarySoft,
    borderColor: Brand.primary,
  },
  networkText: {
    fontSize: 13,
    fontWeight: '700',
    color: Brand.textSecondary,
  },
  networkTextOn: {
    color: Brand.primary,
  },
  field: {
    marginTop: 14,
  },
  payBtn: {
    marginTop: 22,
  },
  secureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 14,
  },
  secureText: {
    fontSize: 12,
    color: Brand.textMuted,
  },

  // Success.
  successWrap: {
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 8,
  },
  successBadge: {
    width: 92,
    height: 92,
    borderRadius: 46,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Brand.successSoft,
  },
  successTitle: {
    marginTop: 18,
    fontSize: 20,
    fontWeight: '800',
    color: Brand.textPrimary,
  },
  successBody: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    color: Brand.textSecondary,
  },
  successBtn: {
    marginTop: 24,
    alignSelf: 'stretch',
  },
});
