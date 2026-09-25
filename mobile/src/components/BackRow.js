import { Pressable, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme, fonts } from '../theme';

export default function BackRow({ label = 'חזרה' }) {
  const theme = useTheme();
  const router = useRouter();
  return (
    <Pressable
      onPress={() => router.back()}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
      hitSlop={8}
    >
      <Text style={[styles.arrow, { color: theme.primary }]} accessibilityElementsHidden importantForAccessibility="no">←</Text>
      <Text style={[styles.label, { color: theme.primary }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    minHeight: 44,
    alignSelf: 'flex-end',
    paddingHorizontal: 4,
    marginBottom: 4,
  },
  pressed: { opacity: 0.6 },
  arrow: { fontSize: 18 },
  label: { fontFamily: fonts.ui, fontSize: 15 },
});
