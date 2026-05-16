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
import LanguageDetector from 'i18next-browser-languagedetector';

import de from './locales/de.json';
import en from './locales/en.json';

export const SUPPORTED_LANGUAGES = ['de', 'en'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

const savedLang = localStorage.getItem('wortnetze.language');
const autoDetect = localStorage.getItem('wortnetze.language.auto') === 'true';

const initOptions: any = {
  fallbackLng: 'en',
  resources: {
    de: { translation: de },
    en: { translation: en },
  },
  interpolation: { escapeValue: false },
  detection: {
    order: autoDetect ? ['localStorage', 'navigator'] : ['localStorage'],
    lookupLocalStorage: 'wortnetze.language',
    caches: ['localStorage'],
  }
};

// If no language is saved and auto-detect is off, default to German
if (!savedLang && !autoDetect) {
  initOptions.lng = 'de';
}

void i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init(initOptions);

export default i18next;
