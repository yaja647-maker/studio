import Link from 'next/link';
import Image from 'next/image';
import { getDictionary } from '@/lib/get-dictionary';
import { type Locale } from '@/lib/i18n-config';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default async function Home({ params: { lang } }: { params: { lang: Locale } }) {
  const dictionary = await getDictionary(lang);
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-logistics');

  return (
    <section className="relative h-[calc(100vh-5rem)] w-full">
      {heroImage && (
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          fill
          className="object-cover"
          data-ai-hint={heroImage.imageHint}
          priority
        />
      )}
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white p-4">
        <h1 className="text-4xl font-extrabold tracking-tight font-headline sm:text-5xl md:text-6xl lg:text-7xl">
          {dictionary.home.heroTitle}
        </h1>
        <p className="mt-6 max-w-3xl text-lg text-gray-200 sm:text-xl md:text-2xl">
          {dictionary.home.heroSubtitle}
        </p>
        <div className="mt-10">
          <Button asChild size="lg">
            <Link href={`/${lang}/services`}>
              {dictionary.home.ctaButton}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
