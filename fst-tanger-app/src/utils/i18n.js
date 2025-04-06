import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import frTranslation from '../locales/fr/translation.json';
import arTranslation from '../locales/ar/translation.json';

// Configure i18n
i18n
  .use(initReactI18next)
  .init({
    resources: {
      fr: {
        translation: frTranslation
      },
      ar: {
        translation: arTranslation
      }
    },
    lng: 'fr', // Default language
    fallbackLng: 'fr',
    interpolation: {
      escapeValue: false // React already escapes values
    },
    react: {
      useSuspense: false // React Suspense is not needed for translations
    }
  });

export default i18n;
