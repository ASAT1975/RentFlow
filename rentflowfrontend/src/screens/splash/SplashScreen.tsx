import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  type StyleProp,
  Text,
  useWindowDimensions,
  View,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  Animation,
  clamp,
  Layout,
  LOGO,
  SplashColors,
  TAGLINE,
  WordmarkFontFamily,
} from './constants';
import { styles } from './styles';

export type SplashScreenProps = {
  onAnimationFinish?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function SplashScreen({ onAnimationFinish, style }: SplashScreenProps) {
  const { width, height } = useWindowDimensions();

  const shorterSide = Math.min(width, height);
  const badgeSize = clamp(shorterSide * Layout.badgeRatio, Layout.badgeMinSize, Layout.badgeMaxSize);
  const logoSize = badgeSize * Layout.logoRatio;
  const titleSize = clamp(width * Layout.titleRatio, Layout.titleMinSize, Layout.titleMaxSize);

  const rootOpacity = useRef(new Animated.Value(1)).current;
  const badgeOpacity = useRef(new Animated.Value(0)).current;
  const badgeScale = useRef(new Animated.Value(0.7)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleShift = useRef(new Animated.Value(18)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const taglineShift = useRef(new Animated.Value(14)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(badgeOpacity, {
        toValue: 1,
        duration: Animation.badgeFadeMs,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(badgeScale, {
        toValue: 1,
        damping: 11,
        stiffness: 120,
        mass: 0.9,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.delay(Animation.titleDelayMs),
        Animated.parallel([
          Animated.timing(titleOpacity, {
            toValue: 1,
            duration: Animation.titleFadeMs,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.spring(titleShift, {
            toValue: 0,
            damping: 14,
            stiffness: 110,
            useNativeDriver: true,
          }),
        ]),
      ]),
      Animated.sequence([
        Animated.delay(Animation.taglineDelayMs),
        Animated.parallel([
          Animated.timing(taglineOpacity, {
            toValue: 1,
            duration: Animation.taglineFadeMs,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.spring(taglineShift, {
            toValue: 0,
            damping: 15,
            stiffness: 110,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ]).start();

    if (onAnimationFinish) {
      const timer = setTimeout(() => {
        Animated.timing(rootOpacity, {
          toValue: 0,
          duration: Animation.fadeOutMs,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }).start();
        setTimeout(onAnimationFinish, Animation.fadeOutMs);
      }, Animation.holdMs);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <Animated.View style={[styles.root, { opacity: rootOpacity }, style]}>
      <LinearGradient
        colors={SplashColors.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      />
      <StatusBar style="light" />

      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.content, { gap: Layout.gap }]}>
          <Animated.View
            style={[
              styles.badge,
              { opacity: badgeOpacity, transform: [{ scale: badgeScale }] },
              { width: badgeSize, height: badgeSize, borderRadius: badgeSize * Layout.badgeRadiusRatio },
            ]}>
            <Image
              source={LOGO}
              style={{ width: logoSize, height: logoSize }}
              contentFit="contain"
              accessibilityLabel="RentFlow logo"
            />
          </Animated.View>

          <View style={styles.textGroup}>
            <Animated.View style={{ opacity: titleOpacity, transform: [{ translateY: titleShift }] }}>
              <Text
                style={[styles.wordmark, { fontSize: titleSize, fontFamily: WordmarkFontFamily }]}
                accessibilityRole="header"
                allowFontScaling={false}>
                RentFlow
              </Text>
            </Animated.View>

            <Animated.View style={{ opacity: taglineOpacity, transform: [{ translateY: taglineShift }] }}>
              <Text style={styles.tagline} allowFontScaling={false}>
                {TAGLINE}
              </Text>
            </Animated.View>
          </View>
        </View>
      </SafeAreaView>
    </Animated.View>
  );
}

export default SplashScreen;
