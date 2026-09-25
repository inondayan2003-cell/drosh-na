import { useEffect, useRef } from 'react';
import { AccessibilityInfo, Animated, Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme, fonts } from '../theme';

const LOGO = 'דרוש-נא';
let hasPlayedIntro = false;

export default function TopBar() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const letterAnims = useRef(LOGO.split('').map(() => new Animated.Value(hasPlayedIntro ? 1 : 0))).current;
  const threadAnim = useRef(new Animated.Value(hasPlayedIntro ? 1 : 0)).current;
  const threadWidth = Math.min(Dimensions.get('window').width, 480) * 0.88;

  useEffect(() => {
    if (hasPlayedIntro) return;
    let cancelled = false;
    AccessibilityInfo.isReduceMotionEnabled?.().then((reduced) => {
      if (cancelled) return;
      hasPlayedIntro = true;
      if (reduced) {
        letterAnims.forEach((a) => a.setValue(1));
        threadAnim.setValue(1);
        return;
      }
      const letterStagger = Animated.stagger(
        90,
        letterAnims.map((a) => Animated.timing(a, { toValue: 1, duration: 260, useNativeDriver: true }))
      );
      Animated.sequence([
        letterStagger,
        Animated.timing(threadAnim, { toValue: 1, duration: 500, useNativeDriver: false }),
      ]).start();
    });
    return () => { cancelled = true; };
  }, []);

  const goHome = () => {
    try { router.dismissAll(); } catch (e) { /* already at root */ }
    router.replace('/');
  };

  return (
    <View style={[styles.wrap, { backgroundColor: theme.primaryDeep, paddingTop: insets.top + 14 }]}>
      <Pressable onPress={goHome} accessibilityRole="button" accessibilityLabel="דרוש-נא, חזרה למסך הבית" hitSlop={10}>
        <Text style={styles.logoRow}>
          {LOGO.split('').map((ch, i) => (
            <Animated.Text
              key={i}
              style={[
                styles.logoChar,
                {
                  opacity: letterAnims[i],
                  transform: [{
                    translateY: letterAnims[i].interpolate({ inputRange: [0, 1], outputRange: [6, 0] }),
                  }],
                },
              ]}
            >
              {ch}
            </Animated.Text>
          ))}
        </Text>
      </Pressable>
      <View style={[styles.threadTrack, { width: threadWidth }]}>
        <Animated.View
          style={[
            styles.thread,
            {
              borderColor: theme.gold,
              width: threadAnim.interpolate({ inputRange: [0, 1], outputRange: [0, threadWidth] }),
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingBottom: 16,
    alignItems: 'center',
  },
  logoRow: {
    fontFamily: fonts.display,
    fontSize: 26,
    color: '#fff',
    letterSpacing: 1,
    writingDirection: 'rtl',
  },
  logoChar: {
    fontFamily: fonts.display,
    fontSize: 26,
    color: '#fff',
  },
  threadTrack: {
    height: 2,
    marginTop: 10,
    alignItems: 'flex-end',
  },
  thread: {
    height: 0,
    borderTopWidth: 2,
    borderStyle: 'dashed',
  },
});
