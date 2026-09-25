import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTheme, fonts } from '../theme';

export function Screen({ children, contentStyle, center }) {
  const theme = useTheme();
  return (
    <ScrollView
      style={[{ backgroundColor: theme.bg }, styles.scroll]}
      contentContainerStyle={[styles.content, center && styles.contentCenter, contentStyle]}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.inner}>{children}</View>
    </ScrollView>
  );
}

export function ScreenTitle({ children, subtitle }) {
  const theme = useTheme();
  return (
    <View style={{ marginBottom: subtitle ? 4 : 18 }}>
      <Text accessibilityRole="header" style={[styles.title, { color: theme.ink }]}>{children}</Text>
      {subtitle ? <Text style={[styles.subtitle, { color: theme.inkSoft }]}>{subtitle}</Text> : null}
    </View>
  );
}

export function Notice({ children, tone = 'default' }) {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.notice,
        {
          backgroundColor: theme.cardBg,
          borderColor: theme.border,
          borderRightColor: tone === 'error' ? theme.danger : theme.gold,
        },
      ]}
      accessibilityLiveRegion="polite"
    >
      <Text style={[styles.noticeText, { color: theme.ink }]}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { padding: 20, paddingBottom: 40, flexGrow: 1, alignItems: 'center' },
  contentCenter: { justifyContent: 'center' },
  inner: { width: '100%', maxWidth: 520 },
  title: { fontFamily: fonts.display, fontSize: 24, textAlign: 'right', writingDirection: 'rtl' },
  subtitle: { fontFamily: fonts.uiRegular, fontSize: 14, marginTop: 6, marginBottom: 14, textAlign: 'right', writingDirection: 'rtl' },
  notice: {
    borderWidth: 1,
    borderRightWidth: 4,
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
  },
  noticeText: { fontFamily: fonts.uiRegular, fontSize: 14, lineHeight: 21, textAlign: 'right', writingDirection: 'rtl' },
});
