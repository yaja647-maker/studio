import { getDictionary } from '@/lib/get-dictionary';
import { type Locale } from '@/lib/i18n-config';
import { ImageEnhancer } from '@/components/image-enhancer';

export default async function BlogPage({ params: { lang } }: { params: { lang: Locale } }) {
  const dictionary = await getDictionary(lang);
  
  return (
    <section className="w-full bg-accent">
      <div className="container mx-auto px-4 py-12 md:px-6 md:py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold font-headline tracking-tight sm:text-5xl">{dictionary.blog.title}</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">{dictionary.blog.subtitle}</p>
        </div>
        <ImageEnhancer dictionary={dictionary.imageEnhancer} />
      </div>
    </section>
  );
}
