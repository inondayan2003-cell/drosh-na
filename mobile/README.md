# דרוש-נא — אפליקציה נטיבית

גרסת iOS/Android של דרוש-נא, בנויה עם Expo + Expo Router (React Native). אותו מוצר, אותו מאגר דוגמה ואותה לוגיקת זיהוי פרשה כמו בגרסת האתר שב־`../`, מותאמים לחוויה נטיבית: ניווט עם מחוות מערכת, גופנים טעונים מקומית, אנימציות עם `Animated`, שיתוף והעתקה דרך ה-API הנטיבי של המכשיר.

## הרצה מקומית (בלי Xcode / Android Studio)

```bash
cd mobile
npx expo start
```

סרוק את קוד ה-QR עם אפליקציית **Expo Go** (חינמית, App Store / Google Play) על הטלפון שלך — אותו Wi-Fi כמו המחשב. זה מריץ את האפליקציה בפועל על המכשיר שלך, בלי לבנות משהו נטיבי מקומית.

רוצה לבדוק בסימולטור iOS? צריך Xcode מלא (לא רק ה-command line tools):
1. התקן Xcode מה-Mac App Store.
2. `sudo xcode-select -s /Applications/Xcode.app/Contents/Developer`
3. `npx expo start` ואז הקש `i`.

## מבנה הפרויקט

```
mobile/
  src/
    app/                 מסכים (Expo Router — כל קובץ הוא route)
      _layout.js         שורש: טעינת גופנים, TopBar קבוע, Stack עם אנימציית RTL
      index.js            בית
      parasha.js           פרשת שבוע (זיהוי אוטומטי + רשימה ידנית)
      general.js           דרשה כללית (חיפוש נושאים)
      length.js            בחירת אורך
      reading.js            מסך קריאה
    components/          רכיבי UI משותפים (TopBar, Parchment, Buttons...)
    context/ToastContext.js   טוסט גלובלי (הודעות "הועתק" וכו')
    data/droshData.js    מאגר לדוגמה — זהה במבנה ל-data.js של האתר
    lib/parasha.js        לוגיקת Hebcal, מפת כינויי פרשות, חישוב זמן קריאה
    theme.js              טוקני עיצוב (צבעים בהיר/כהה, גופנים)
  app.json               קונפיגורציית Expo (שם, אייקונים, splash, bundle id)
  assets/                אייקון, splash, favicon — ממותגים (תכלת/זהב)
```

## הבדלים מכוונים מגרסת האתר

- ניווט: Expo Router (מחסנית native) במקום ניהול מסך ידני ב-DOM.
- פסוקים מצוטטים בטקסט הדרשה מסומנים בצבע ולא בקו גבול (מגבלת רינדור טקסט native).
- גודל טקסט וטוסטים משתמשים ב-`Animated` API של React Native במקום CSS.

## דרך להתקנה אמיתית (בלי Xcode/Android Studio בכלל)

[EAS](https://docs.expo.dev/eas/index.md) בונה, חותם ומפרסם את האפליקציה בענן:

```bash
npx eas-cli@latest build --profile development --platform ios
npx eas-cli@latest build --profile development --platform android
```

דורש חשבון Expo (חינמי) וחשבון מפתחים של Apple/Google בשביל הפצה סופית ל-App Store / Google Play.

## מה עוד חסר (לפני הוצאה לשוק)

- תוכן דרשות אמיתי (`src/data/droshData.js` הוא דוגמה בלבד, זהה לזה שבאתר).
- בדיקת נגישות עם VoiceOver / TalkBack בפועל.
- חשבונות Apple Developer / Google Play Console + הגשה בפועל.
- אייקונים/Splash הנוכחיים נוצרו פרוגרמטית (מונוגרם זהב על תכלת) — כדאי מעבר עיצובי לפני הוצאה לחנויות.
