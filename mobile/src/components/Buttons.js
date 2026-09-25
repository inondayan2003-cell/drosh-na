import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme, fonts } from '../theme';

export function PrimaryButton({ title, onPress, disabled, accessibilityLabel }) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityState={{ disabled: !!disabled }}
      style={({ pressed }) => [
        styles.primary,
        { backgroundColor: theme.primary, opacity: disabled ? 0.45 : pressed ? 0.85 : 1 },
        pressed && !disabled && styles.pressedScale,
      ]}
    >
      <Text style={[styles.primaryText, { color: theme.onPrimary }]}>{title}</Text>
    </Pressable>
  );
}

export function HomeCard({ title, description, onPress }) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${description}`}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: theme.cardBg, borderRightColor: theme.primary, shadowColor: theme.shadow },
        pressed && styles.pressedScale,
      ]}
    >
      <Text style={[styles.cardTitle, { color: theme.ink }]}>{title}</Text>
      <Text style={[styles.cardDesc, { color: theme.inkSoft }]}>{description}</Text>
    </Pressable>
  );
}

export function LengthCard({ title, timeLabel, caption, onPress, disabled }) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={disabled ? `${title}, ${caption}` : `${title}, ${timeLabel}`}
      accessibilityState={{ disabled: !!disabled }}
      style={({ pressed }) => [
        styles.lengthCard,
        { backgroundColor: theme.cardBg, borderColor: theme.border, opacity: disabled ? 0.5 : 1 },
        pressed && !disabled && styles.pressedScale,
      ]}
    >
      <Text style={[styles.lengthTitle, { color: theme.ink }]}>{title}</Text>
      {disabled ? (
        <Text style={[styles.lengthCaption, { color: theme.inkSoft }]}>{caption}</Text>
      ) : (
        <Text style={[styles.lengthTime, { color: theme.primary }]}>{timeLabel}</Text>
      )}
    </Pressable>
  );
}

export function IconButton({ label, onPress, accessibilityLabel, active }) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || label}
      style={({ pressed }) => [
        styles.iconBtn,
        { backgroundColor: theme.cardBg, borderColor: theme.border },
        pressed && styles.pressedScale,
      ]}
    >
      <Text style={[styles.iconBtnText, { color: theme.ink }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  primary: {
    minHeight: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  primaryText: { fontFamily: fonts.uiBold, fontSize: 16 },
  pressedScale: { transform: [{ scale: 0.98 }] },
  card: {
    borderRadius: 14,
    padding: 18,
    marginBottom: 14,
    borderRightWidth: 5,
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardTitle: { fontFamily: fonts.display, fontSize: 21, textAlign: 'right', writingDirection: 'rtl' },
  cardDesc: { fontFamily: fonts.uiRegular, fontSize: 14, marginTop: 6, textAlign: 'right', writingDirection: 'rtl', lineHeight: 20 },
  lengthCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 18,
    minHeight: 44,
  },
  lengthTitle: { fontFamily: fonts.display, fontSize: 19, textAlign: 'right', writingDirection: 'rtl' },
  lengthTime: { fontFamily: fonts.ui, fontSize: 14, color: '#2D5B9A', marginTop: 6, textAlign: 'right' },
  lengthCaption: { fontFamily: fonts.uiRegular, fontSize: 12, marginTop: 6, textAlign: 'right', writingDirection: 'rtl' },
  iconBtn: {
    minWidth: 44,
    minHeight: 44,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  iconBtnText: { fontFamily: fonts.ui, fontSize: 14 },
});
