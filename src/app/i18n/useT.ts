/**
 * useT — thin wrapper over react-i18next's useTranslation. Single chokepoint
 * for future typed-key safety, library swaps, or instrumentation. Consumers
 * import only this hook, never `react-i18next` directly.
 */

import { useTranslation } from 'react-i18next';
import type { SupportedLanguage } from './index';

export function useT() {
  const { t, i18n } = useTranslation();
  return {
    t,
    language: i18n.language as SupportedLanguage,
    setLanguage: (lng: SupportedLanguage) => i18n.changeLanguage(lng),
  };
}
