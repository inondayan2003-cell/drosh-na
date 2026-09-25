import { useColorScheme } from 'react-native';

const light = {
  primary: '#2D5B9A',
  primaryDeep: '#1F295F',
  gold: '#B8913A',
  bg: '#F5F6F8',
  parchment: '#FBF7EE',
  ink: '#1C2230',
  inkSoft: 'rgba(28,34,48,0.62)',
  cardBg: '#FFFFFF',
  border: 'rgba(28,34,48,0.12)',
  danger: '#9A3B3B',
  onPrimary: '#FFFFFF',
  shadow: '#0B1020',
};

const dark = {
  primary: '#7EA6DE',
  primaryDeep: '#141B3E',
  gold: '#D6B25E',
  bg: '#131822',
  parchment: '#1E2230',
  ink: '#E7EAF0',
  inkSoft: 'rgba(231,234,240,0.62)',
  cardBg: '#1A2030',
  border: 'rgba(231,234,240,0.14)',
  danger: '#D98888',
  onPrimary: '#0B1220',
  shadow: '#000000',
};

export const fonts = {
  display: 'SuezOne_400Regular',
  reading: 'FrankRuhlLibre_500Medium',
  readingBold: 'FrankRuhlLibre_700Bold',
  ui: 'Assistant_600SemiBold',
  uiRegular: 'Assistant_400Regular',
  uiBold: 'Assistant_700Bold',
};

export function useTheme() {
  const scheme = useColorScheme();
  return scheme === 'dark' ? dark : light;
}

export const WORDS_PER_MINUTE = 120;
