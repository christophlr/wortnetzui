/**
 * i18next bootstrap. Synchronous: locale JSON is bundled, no network fetch.
 *
 * Default language: German. Fallback: English. The language-switch UI
 * (phase 4.3) wires localStorage persistence + an opt-in browser-language
 * detector; this module only sets the initial baseline.
 *
 * Importing the module triggers the side-effect init. `main.tsx` does this
 * before `<App>` so the first paint already has translations.
 */

import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import de from './locales/de.json';
import en from './locales/en.json';

export const SUPPORTED_LANGUAGES = ['de', 'en'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

void i18next.use(initReactI18next).init({
  lng: 'de',
  fallbackLng: 'en',
  resources: {
    de: { translation: de },
    en: { translation: en },
  },
  interpolation: { escapeValue: false },
});

export default i18next;
