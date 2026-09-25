import { View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen, ScreenTitle, Notice } from '../components/Screen';
import BackRow from '../components/BackRow';
import { LengthCard } from '../components/Buttons';
import { DROSH_DATA } from '../data/droshData';
import { minutesFor, entryFor, titleFor } from '../lib/parasha';

export default function LengthScreen() {
  const router = useRouter();
  const { type, name } = useLocalSearchParams();

  const entry = entryFor(DROSH_DATA, type, name);
  const title = titleFor(type, name);

  const short = entry?.short || null;
  const long = entry?.long || null;

  const goRead = (len) => router.push({ pathname: '/reading', params: { type, name, len } });

  return (
    <Screen>
      <BackRow />
      <ScreenTitle subtitle="בחר אורך דרשה">{title}</ScreenTitle>

      <View style={{ gap: 12 }}>
        <LengthCard
          title="קצרה"
          timeLabel={short ? `כ-${minutesFor(short.text)} דקות דיבור` : ''}
          caption="הדרשה הזאת עוד לא נוספה למאגר"
          disabled={!short}
          onPress={() => goRead('short')}
        />
        <LengthCard
          title="ארוכה"
          timeLabel={long ? `כ-${minutesFor(long.text)} דקות דיבור` : ''}
          caption="הדרשה הזאת עוד לא נוספה למאגר"
          disabled={!long}
          onPress={() => goRead('long')}
        />
      </View>

      {!short && !long && <View style={{ height: 16 }} />}
      {!short && !long && <Notice>הדרשה הזאת עוד לא נוספה למאגר. בקרוב!</Notice>}
    </Screen>
  );
}
