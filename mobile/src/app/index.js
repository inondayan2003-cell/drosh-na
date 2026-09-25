import { Image, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../components/Screen';
import { HomeCard } from '../components/Buttons';
import { useTheme, fonts } from '../theme';

const heroMark = require('../../assets/hero-mark.png');

export default function HomeScreen() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <Screen center>
      <Text accessibilityRole="header" style={styles.srOnly}>דרוש-נא</Text>
      <View style={[styles.hero, { backgroundColor: theme.primaryDeep }]}>
        <Image
          source={heroMark}
          style={styles.heroImage}
          resizeMode="contain"
          accessible={false}
          importantForAccessibility="no"
          alt=""
        />
      </View>

      <Text style={[styles.tagline, { color: theme.inkSoft }]}>
        דרשה מוכנה לשבת, לחג או לאירוע — באורך שאתה בוחר, תוך פחות מדקה.
      </Text>

      <HomeCard
        title="פרשת שבוע"
        description="דרשה על פרשת השבוע הקרובה, מזוהה אוטומטית"
        onPress={() => router.push('/parasha')}
      />
      <HomeCard
        title="דרשה כללית"
        description="דרשה לפי נושא – שמחה, אבל, חג, אירוע ועוד"
        onPress={() => router.push('/general')}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  srOnly: {
    position: 'absolute',
    width: 1,
    height: 1,
    overflow: 'hidden',
    opacity: 0,
  },
  hero: {
    width: '100%',
    aspectRatio: 1.7,
    maxHeight: 260,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  heroImage: {
    width: '78%',
    height: '78%',
  },
  tagline: {
    fontFamily: fonts.uiRegular,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 26,
  },
});
