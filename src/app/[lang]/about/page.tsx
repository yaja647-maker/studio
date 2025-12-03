import Image from 'next/image';
import { getDictionary } from '@/lib/get-dictionary';
import { type Locale } from '@/lib/i18n-config';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default async function AboutPage({ params: { lang } }: { params: { lang: Locale } }) {
  const dictionary = await getDictionary(lang);
  const d = dictionary.about;
  const aboutImage = PlaceHolderImages.find(p => p.id === 'about-us-team');

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-16">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="order-2 md:order-1">
          <h1 className="text-4xl font-bold font-headline tracking-tight sm:text-5xl">{d.title}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{d.subtitle}</p>
          <div className="mt-6 space-y-4 text-foreground/80">
            <p>{d.p1}</p>
            <p>{d.p2}</p>
          </div>
        </div>
        <div className="order-1 md:order-2">
          {aboutImage && (
            <div className="relative aspect-square md:aspect-[4/3] overflow-hidden rounded-lg shadow-lg">
              <Image
                src={aboutImage.imageUrl}
                alt={aboutImage.description}
                fill
                className="object-cover"
                data-ai-hint={aboutImage.imageHint}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
