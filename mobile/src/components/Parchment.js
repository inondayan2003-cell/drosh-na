import { useEffect, useRef } from 'react';
import { AccessibilityInfo, Animated, StyleSheet, Text, View } from 'react-native';
import { useTheme, fonts } from '../theme';

function splitQuotes(text) {
  const parts = text.split(/("[^"]+")/g);
  return parts.filter((p) => p.length > 0);
}

function Paragraph({ text, isFirst, theme, fontScale }) {
  let firstWord = null;
  let rest = text;
  if (isFirst) {
    const m = text.match(/^(\S+)(\s[\s\S]*)?$/);
    if (m) {
      firstWord = m[1];
      rest = m[2] || '';
    }
  }
  const restSegments = splitQuotes(rest);
  const bodySegments = isFirst ? restSegments : splitQuotes(text);

  return (
    <Text style={[styles.paragraph, { color: theme.ink, fontSize: 19 * fontScale }]}>
      {isFirst && firstWord ? (
        <Text style={[styles.openingWord, { color: theme.gold, fontSize: 19 * fontScale * 1.15 }]}>{firstWord}</Text>
      ) : null}
      {bodySegments.map((seg, i) =>
        seg.startsWith('"') && seg.endsWith('"') ? (
          <Text key={i} style={[styles.pasuk, { color: theme.primary, fontSize: 19 * fontScale * 1.03 }]}>{seg}</Text>
        ) : (
          <Text key={i}>{seg}</Text>
        )
      )}
    </Text>
  );
}

function Separator({ theme }) {
  return (
    <View style={styles.sepRow} accessibilityElementsHidden importantForAccessibility="no">
      <View style={[styles.sepDot, { backgroundColor: theme.gold }]} />
      <View style={[styles.sepDot, styles.sepDotMid, { backgroundColor: theme.gold }]} />
      <View style={[styles.sepDot, { backgroundColor: theme.gold }]} />
    </View>
  );
}

export function Parchment({ paragraphs, fontScale }) {
  const theme = useTheme();
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled?.().then((reduced) => {
      if (reduced) {
        anim.setValue(1);
      } else {
        Animated.timing(anim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
      }
    });
  }, []);

  return (
    <Animated.View
      style={[
        styles.card,
        {
          backgroundColor: theme.parchment,
          shadowColor: theme.shadow,
          opacity: anim,
          transform: [
            { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [-8, 0] }) },
            { scaleY: anim.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] }) },
          ],
        },
      ]}
    >
      {paragraphs.map((p, i) => (
        <View key={i}>
          <Paragraph text={p} isFirst={i === 0} theme={theme} fontScale={fontScale} />
          {i < paragraphs.length - 1 && <Separator theme={theme} />}
        </View>
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    padding: 20,
    paddingBottom: 26,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  paragraph: {
    fontFamily: fonts.reading,
    lineHeight: 34,
    textAlign: 'right',
    writingDirection: 'rtl',
    marginBottom: 16,
  },
  openingWord: {
    fontFamily: fonts.readingBold,
  },
  pasuk: {
    fontFamily: fonts.reading,
  },
  sepRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
    marginTop: -2,
  },
  sepDot: { width: 5, height: 5, borderRadius: 3 },
  sepDotMid: { marginTop: -3 },
});
