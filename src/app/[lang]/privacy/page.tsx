import { getDictionary } from '@/lib/get-dictionary';
import { type Locale } from '@/lib/i18n-config';

export default async function PrivacyPage({ params: { lang } }: { params: { lang: Locale } }) {
  const dictionary = await getDictionary(lang);
  const d = dictionary.legal;

  return (
    <section className="w-full bg-accent py-12 md:py-16 min-h-[calc(100vh-13rem)]">
      <div className="container mx-auto px-4">
        <div className="prose max-w-4xl mx-auto bg-card p-8 rounded-lg shadow">
          <h1 className="text-4xl font-bold font-headline tracking-tight sm:text-5xl">{d.privacyTitle}</h1>
          <p className="mt-6 text-lg text-muted-foreground">{d.content}</p>
        </div>
      </div>
    </section>
  );
}
