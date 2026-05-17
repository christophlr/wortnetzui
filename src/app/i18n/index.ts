/**
 * i18next bootstrap. Synchronous: locale JSON is bundled, no network fetch.
 *
 * Default language: German. Fallback: English. The language-switch UI
 * wires localStorage persistence + an opt-in browser-language detector;
 * this module only sets the initial baseline.
 *
 * Importing the module triggers the side-effect init. `main.tsx` does this
 * before `<App>` so the first paint already has translations.
 */

import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import type { InitOptions } from 'i18next';

import de from './locales/de.json';
import en from './locales/en.json';

export const SUPPORTED_LANGUAGES = ['de', 'en'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const LANGUAGE_STORAGE_KEY = 'wortnetze.language';
export const LANGUAGE_AUTO_KEY = 'wortnetze.language.auto';

/** Maps any BCP-47 tag (e.g. 'de-DE', 'en-US') to a SupportedLanguage. Falls back to 'de'. */
export function normalizeLanguage(lng: string | undefined): SupportedLanguage {
  if (!lng) return 'de';
  const base = lng.split('-')[0].toLowerCase();
  return (SUPPORTED_LANGUAGES as readonly string[]).includes(base)
    ? (base as SupportedLanguage)
    : 'de';
}

const savedLang = localStorage.getItem(LANGUAGE_STORAGE_KEY);
const autoDetect = localStorage.getItem(LANGUAGE_AUTO_KEY) === 'true';

const initOptions: InitOptions = {
  fallbackLng: 'en',
  resources: {
    de: { translation: de },
    en: { translation: en },
  },
  interpolation: { escapeValue: false },
  detection: {
    order: autoDetect ? ['localStorage', 'navigator'] : ['localStorage'],
    lookupLocalStorage: LANGUAGE_STORAGE_KEY,
    caches: ['localStorage'],
  },
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
