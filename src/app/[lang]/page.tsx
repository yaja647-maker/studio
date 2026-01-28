import Link from 'next/link';
import Image from 'next/image';
import { getDictionary } from '@/lib/get-dictionary';
import { type Locale } from '@/lib/i18n-config';
import { Button } from '@/components/ui/button';

export default async function Home({ params: { lang } }: { params: { lang: Locale } }) {
  const dictionary = await getDictionary(lang);

  return (
    <section className="relative h-[calc(100vh-5rem)] w-full">
      <Image
        src="/images/unnamed.png"
        alt="TRANSPORTESJADIANI"
        fill
        className="object-cover"
        data-ai-hint="logistics transport"
        priority
      />
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
