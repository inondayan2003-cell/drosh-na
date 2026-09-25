import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen, ScreenTitle, Notice } from '../components/Screen';
import BackRow from '../components/BackRow';
import { PrimaryButton } from '../components/Buttons';
import { useTheme, fonts } from '../theme';
import { DROSH_DATA } from '../data/droshData';
import { hasAny } from '../lib/parasha';
import { HOLIDAY_ORDER, detectHoliday } from '../lib/holiday';

export default function HolidayScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [state, setState] = useState({ loading: true, error: false, detected: null });
  const [pickerOpen, setPickerOpen] = useState(false);
  const pulse = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    let cancelled = false;
    detectHoliday()
      .then((resolved) => {
        if (cancelled) return;
        setState({ loading: false, error: false, detected: resolved });
      })
      .catch(() => {
        if (cancelled) return;
        setState({ loading: false, error: true, detected: null });
        setPickerOpen(true);
      });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!state.loading) return;
    let anim;
    AccessibilityInfo.isReduceMotionEnabled?.().then((reduced) => {
      if (reduced) return;
      anim = Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, { toValue: 0.9, duration: 550, useNativeDriver: true }),
          Animated.timing(pulse, { toValue: 0.35, duration: 550, useNativeDriver: true }),
        ])
      );
      anim.start();
    });
    return () => anim?.stop();
  }, [state.loading]);

  const goToLength = (name) => router.push({ pathname: '/length', params: { type: 'holiday', name } });

  return (
    <Screen>
      <BackRow />
      <ScreenTitle>דרשה לחג</ScreenTitle>

      {state.error && <Notice tone="error">לא הצלחנו לאתר את החג הקרוב אוטומטית. בחר חג מהרשימה.</Notice>}

      <View style={[styles.board, { backgroundColor: theme.cardBg, borderColor: theme.gold }]}>
        {state.loading ? (
          <Animated.Text style={[styles.boardName, { color: theme.primary, opacity: pulse }]}>
            מאתר את החג…
          </Animated.Text>
        ) : (
          <Text style={[styles.boardName, { color: theme.primary }]} accessibilityLiveRegion="polite">
            {state.detected || 'בחר חג מהרשימה'}
          </Text>
        )}
      </View>

      {!state.loading && state.detected && (
        <PrimaryButton title="המשך לבחירת אורך" onPress={() => goToLength(state.detected)} />
      )}

      <Pressable
        onPress={() => setPickerOpen((v) => !v)}
        accessibilityRole="button"
        accessibilityState={{ expanded: pickerOpen }}
        style={styles.toggleRow}
      >
        <Text style={[styles.toggleLabel, { color: theme.primary }]}>
          {pickerOpen ? 'הסתר רשימה' : 'בחר חג אחר מהרשימה'}
        </Text>
      </Pressable>

      {pickerOpen && (
        <ScrollView
          style={[styles.pickerBox, { borderColor: theme.border, backgroundColor: theme.cardBg }]}
          nestedScrollEnabled
        >
          {HOLIDAY_ORDER.map((name) => {
            const available = hasAny(DROSH_DATA.holidays[name]);
            return (
              <Pressable
                key={name}
                disabled={!available}
                onPress={() => goToLength(name)}
                accessibilityRole="button"
                accessibilityState={{ disabled: !available }}
                style={({ pressed }) => [
                  styles.pickerRow,
                  { borderBottomColor: theme.border },
                  pressed && available && { opacity: 0.6 },
                ]}
              >
                <Text style={{ fontFamily: fonts.uiRegular, fontSize: 15, color: available ? theme.ink : theme.inkSoft, textAlign: 'right' }}>
                  {name}{!available ? ' (בקרוב)' : ''}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  board: {
    borderWidth: 1,
    borderRadius: 14,
    minHeight: 96,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 26,
    marginBottom: 16,
  },
  boardName: { fontFamily: fonts.display, fontSize: 24, textAlign: 'center', writingDirection: 'rtl' },
  toggleRow: { minHeight: 44, alignItems: 'flex-end', justifyContent: 'center' },
  toggleLabel: { fontFamily: fonts.ui, fontSize: 14 },
  pickerBox: { maxHeight: 320, borderWidth: 1, borderRadius: 10, marginTop: 8 },
  pickerRow: { minHeight: 44, justifyContent: 'center', paddingHorizontal: 14, borderBottomWidth: StyleSheet.hairlineWidth },
});
