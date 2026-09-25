import { useState } from 'react';
import { Share, StyleSheet, Text, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useLocalSearchParams } from 'expo-router';
import { Screen, Notice } from '../components/Screen';
import BackRow from '../components/BackRow';
import { IconButton } from '../components/Buttons';
import { Parchment } from '../components/Parchment';
import { useToast } from '../context/ToastContext';
import { useTheme, fonts } from '../theme';
import { DROSH_DATA } from '../data/droshData';
import { minutesFor, wordCount } from '../lib/parasha';

export default function ReadingScreen() {
  const theme = useTheme();
  const toast = useToast();
  const { type, name, len } = useLocalSearchParams();
  const [fontScale, setFontScale] = useState(1);

  const entry = type === 'parasha'
    ? DROSH_DATA.parashot[name]
    : DROSH_DATA.topics.find((t) => t.name === name);
  const drasha = entry ? entry[len] : null;

  if (!drasha) {
    return (
      <Screen>
        <BackRow />
        <Notice tone="error">הדרשה הזאת לא נמצאה.</Notice>
      </Screen>
    );
  }

  const context = type === 'parasha' ? `פרשת ${name}` : name;
  const minutes = minutesFor(drasha.text);
  const words = wordCount(drasha.text);
  const plainText = `${drasha.title}\n\n${drasha.text.join('\n\n')}`;

  const clampScale = (v) => Math.max(0.8, Math.min(1.8, Math.round(v * 10) / 10));

  const onCopy = async () => {
    try {
      await Clipboard.setStringAsync(plainText);
      toast('הדרשה הועתקה');
    } catch (e) {
      toast('ההעתקה לא עבדה. סמן את הטקסט והעתק ידנית.', 'error');
    }
  };

  const onShare = async () => {
    try {
      await Share.share({ title: drasha.title, message: plainText });
    } catch (e) {
      // user cancelled or share failed silently — no action needed
    }
  };

  return (
    <Screen>
      <BackRow label="חזרה לבחירת אורך" />

      <View style={styles.header}>
        <Text style={[styles.context, { color: theme.primary }]}>
          {context} · {len === 'short' ? 'קצרה' : 'ארוכה'}
        </Text>
        <Text accessibilityRole="header" style={[styles.title, { color: theme.ink }]}>{drasha.title}</Text>
        <Text style={[styles.meta, { color: theme.inkSoft }]}>
          כ-{minutes} דקות דיבור · {words} מילים
        </Text>
      </View>

      <View style={[styles.toolbar, { borderBottomColor: theme.border }]}>
        <View style={styles.toolGroup}>
          <IconButton label="א-" accessibilityLabel="הקטן טקסט" onPress={() => setFontScale((s) => clampScale(s - 0.1))} />
          <Text style={[styles.pct, { color: theme.inkSoft }]}>{Math.round(fontScale * 100)}%</Text>
          <IconButton label="א+" accessibilityLabel="הגדל טקסט" onPress={() => setFontScale((s) => clampScale(s + 0.1))} />
        </View>
        <View style={styles.toolGroup}>
          <IconButton label="העתק דרשה" onPress={onCopy} />
          <IconButton label="שתף" onPress={onShare} />
        </View>
      </View>

      <Parchment paragraphs={drasha.text} fontScale={fontScale} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: 14 },
  context: { fontFamily: fonts.uiBold, fontSize: 13, textAlign: 'right', marginBottom: 4 },
  title: { fontFamily: fonts.display, fontSize: 23, textAlign: 'right', writingDirection: 'rtl', marginBottom: 6 },
  meta: { fontFamily: fonts.uiRegular, fontSize: 13, textAlign: 'right' },
  toolbar: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    marginBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 8,
  },
  toolGroup: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6 },
  pct: { fontFamily: fonts.uiRegular, fontSize: 12, minWidth: 38, textAlign: 'center' },
});
