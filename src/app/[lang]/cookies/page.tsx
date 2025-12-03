import { getDictionary } from '@/lib/get-dictionary';
import { type Locale } from '@/lib/i18n-config';

export default async function CookiesPage({ params: { lang } }: { params: { lang: Locale } }) {
  const dictionary = await getDictionary(lang);
  const d = dictionary.legal;

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-16">
      <div className="prose max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold font-headline tracking-tight sm:text-5xl">{d.cookiesTitle}</h1>
        <p className="mt-6 text-lg text-muted-foreground">{d.content}</p>
      </div>
    </div>
  );
}
