export const i18n = {
  defaultLocale: 'ca',
  locales: ['en', 'ca', 'es', 'fr'],
} as const;

export type Locale = (typeof i18n)['locales'][number];
