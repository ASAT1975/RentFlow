import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { type StyleProp, Text, useWindowDimensions, View, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
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
  /**
   * Called once the exit animation finishes. Provide this when using the splash
   * as a launch overlay so the host can unmount it. Omit it to keep the splash
   * on screen indefinitely (e.g. as a standalone route).
   */
  onAnimationFinish?: () => void;
  /** Extra root style — used to turn the screen into a full-screen overlay. */
  style?: StyleProp<ViewStyle>;
};

/**
 * RentFlow splash screen.
 *
 * The design is rebuilt with native components on a blue → indigo gradient;
 * only the custom "R" house mark is an image (recoloured to brand indigo).
 * Reanimated drives the choreography:
 *   - the badge fades and springs in, then breathes gently;
 *   - the wordmark and tagline fade and slide up just after;
 *   - the background glow drifts slowly;
 *   - the whole screen fades out to hand off to the app.
 */
export function SplashScreen({ onAnimationFinish, style }: SplashScreenProps) {
  const { width, height } = useWindowDimensions();

  // Responsive sizing — scales cleanly across phones and tablets.
  const shorterSide = Math.min(width, height);
  const badgeSize = clamp(shorterSide * Layout.badgeRatio, Layout.badgeMinSize, Layout.badgeMaxSize);
  const logoSize = badgeSize * Layout.logoRatio;
  const titleSize = clamp(width * Layout.titleRatio, Layout.titleMinSize, Layout.titleMaxSize);

  // Shared values driving entrance, ambient and exit animations.
  const rootOpacity = useSharedValue(1);
  const badgeOpacity = useSharedValue(0);
  const badgeScale = useSharedValue(0.7);
  const badgePulse = useSharedValue(1);
  const titleOpacity = useSharedValue(0);
  const titleShift = useSharedValue(18);
  const taglineOpacity = useSharedValue(0);
  const taglineShift = useSharedValue(14);
  const glowDrift = useSharedValue(0);

  useEffect(() => {
    // Entrance.
    badgeOpacity.value = withTiming(1, {
      duration: Animation.badgeFadeMs,
      easing: Easing.out(Easing.cubic),
    });
    badgeScale.value = withSpring(1, { damping: 11, stiffness: 120, mass: 0.9 });
    titleOpacity.value = withDelay(
      Animation.titleDelayMs,
      withTiming(1, { duration: Animation.titleFadeMs, easing: Easing.out(Easing.cubic) }),
    );
    titleShift.value = withDelay(
      Animation.titleDelayMs,
      withSpring(0, { damping: 14, stiffness: 110 }),
    );
    taglineOpacity.value = withDelay(
      Animation.taglineDelayMs,
      withTiming(1, { duration: Animation.taglineFadeMs, easing: Easing.out(Easing.cubic) }),
    );
    taglineShift.value = withDelay(
      Animation.taglineDelayMs,
      withSpring(0, { damping: 15, stiffness: 110 }),
    );

    // Ambient: gentle breathing badge + slowly drifting glow.
    badgePulse.value = withDelay(
      Animation.pulseDelayMs,
      withRepeat(
        withSequence(
          withTiming(1.04, { duration: Animation.pulsePeriodMs, easing: Easing.inOut(Easing.quad) }),
          withTiming(1, { duration: Animation.pulsePeriodMs, easing: Easing.inOut(Easing.quad) }),
        ),
        -1,
        false,
      ),
    );
    glowDrift.value = withRepeat(
      withTiming(1, { duration: Animation.glowDriftMs, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );

    // Exit — animate the fade with Reanimated, but drive the actual dismissal
    // from a JS timer so it fires reliably on every platform (incl. web),
    // independent of the worklet callback.
    if (onAnimationFinish) {
      rootOpacity.value = withDelay(
        Animation.holdMs,
        withTiming(0, { duration: Animation.fadeOutMs, easing: Easing.in(Easing.cubic) }),
      );
      const timer = setTimeout(onAnimationFinish, Animation.holdMs + Animation.fadeOutMs);
      return () => clearTimeout(timer);
    }
    // Run the choreography once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rootStyle = useAnimatedStyle(() => ({ opacity: rootOpacity.value }));
  const badgeStyle = useAnimatedStyle(() => ({
    opacity: badgeOpacity.value,
    transform: [{ scale: badgeScale.value * badgePulse.value }],
  }));
  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleShift.value }],
  }));
  const taglineStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
    transform: [{ translateY: taglineShift.value }],
  }));
  const glowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(glowDrift.value, [0, 1], [0.16, 0.28]),
    transform: [{ translateY: interpolate(glowDrift.value, [0, 1], [-8, 8]) }],
  }));

  return (
    <Animated.View style={[styles.root, rootStyle, style]}>
      <LinearGradient
        colors={SplashColors.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      />
      <Animated.View style={[styles.glow, glowStyle]} pointerEvents="none" />
      <StatusBar style="light" />

      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.content, { gap: Layout.gap }]}>
          <Animated.View
            style={[
              styles.badge,
              badgeStyle,
              {
                width: badgeSize,
                height: badgeSize,
                borderRadius: badgeSize * Layout.badgeRadiusRatio,
              },
            ]}>
            <Image
              source={LOGO}
              style={{ width: logoSize, height: logoSize }}
              contentFit="contain"
              accessibilityLabel="RentFlow logo"
            />
          </Animated.View>

          <View style={styles.textGroup}>
            <Animated.View style={titleStyle}>
              <Text
                style={[styles.wordmark, { fontSize: titleSize, fontFamily: WordmarkFontFamily }]}
                accessibilityRole="header"
                allowFontScaling={false}>
                RentFlow
              </Text>
            </Animated.View>

            <Animated.View style={taglineStyle}>
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
