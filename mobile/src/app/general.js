import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen, ScreenTitle } from '../components/Screen';
import BackRow from '../components/BackRow';
import { useTheme, fonts } from '../theme';
import { DROSH_DATA } from '../data/droshData';
import { hasAny } from '../lib/parasha';

export default function GeneralScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim();
    const list = DROSH_DATA.topics.filter((t) => {
      if (!q) return true;
      const hay = t.name + ' ' + (t.tags || []).join(' ');
      return hay.indexOf(q) !== -1;
    });
    return list.slice().sort((a, b) => (hasAny(a) ? 0 : 1) - (hasAny(b) ? 0 : 1));
  }, [query]);

  return (
    <Screen>
      <BackRow />
      <ScreenTitle>דרשה כללית</ScreenTitle>

      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="חפש נושא… (למשל: חתונה, אבל, חג)"
        placeholderTextColor={theme.inkSoft}
        style={[styles.search, { borderColor: theme.border, backgroundColor: theme.cardBg, color: theme.ink }]}
        textAlign="right"
        accessibilityLabel="חיפוש נושא"
      />

      {filtered.length === 0 ? (
        <Text style={[styles.empty, { color: theme.inkSoft }]}>
          אין נושא בשם «{query}» עדיין. נסה מילה אחרת.
        </Text>
      ) : (
        <View style={{ gap: 8 }}>
          {filtered.map((t) => {
            const available = hasAny(t);
            return (
              <Pressable
                key={t.name}
                disabled={!available}
                onPress={() => router.push({ pathname: '/length', params: { type: 'topic', name: t.name } })}
                accessibilityRole="button"
                accessibilityState={{ disabled: !available }}
                style={({ pressed }) => [
                  styles.row,
                  { borderColor: theme.border, backgroundColor: theme.cardBg },
                  pressed && available && { opacity: 0.7 },
                ]}
              >
                <View style={styles.rowRight}>
                  {available && <View style={[styles.dot, { backgroundColor: theme.gold }]} />}
                  <Text
                    numberOfLines={1}
                    style={[styles.rowName, { color: available ? theme.ink : theme.inkSoft }]}
                  >
                    {t.name}
                  </Text>
                </View>
                {!available && (
                  <View style={[styles.soonTag, { backgroundColor: theme.bg }]}>
                    <Text style={[styles.soonText, { color: theme.inkSoft }]}>בקרוב</Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  search: {
    minHeight: 44,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    fontFamily: fonts.uiRegular,
    fontSize: 15,
    marginBottom: 14,
  },
  empty: { textAlign: 'center', fontFamily: fonts.uiRegular, fontSize: 14, lineHeight: 22, paddingVertical: 32 },
  row: {
    minHeight: 44,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowRight: { flexDirection: 'row-reverse', alignItems: 'center', flexShrink: 1, gap: 10 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  rowName: { fontFamily: fonts.uiBold, fontSize: 15, flexShrink: 1, textAlign: 'right' },
  soonTag: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3 },
  soonText: { fontFamily: fonts.uiRegular, fontSize: 12 },
});
