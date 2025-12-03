import type { ReactNode } from 'react';
import type { Locale } from '@/lib/i18n-config';
import { getDictionary } from '@/lib/get-dictionary';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { lang: Locale };
}) {
  const dictionary = await getDictionary(params.lang);
  return (
    <div className="flex flex-col min-h-screen">
      <Header lang={params.lang} dictionary={dictionary.navigation} />
      <main className="flex-grow">{children}</main>
      <Footer lang={params.lang} dictionary={dictionary.footer} />
    </div>
  );
}
