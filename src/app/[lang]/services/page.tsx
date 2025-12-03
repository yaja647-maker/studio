import Image from 'next/image';
import Link from 'next/link';
import { getDictionary } from '@/lib/get-dictionary';
import { type Locale } from '@/lib/i18n-config';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { CheckCircle } from 'lucide-react';

const serviceData = [
  {
    id: 'sea-freight',
    imageId: 'service-sea-freight',
  },
  {
    id: 'air-freight',
    imageId: 'service-air-freight',
  },
  {
    id: 'warehousing',
    imageId: 'service-warehousing',
  },
];

export default async function ServicesPage({ params: { lang } }: { params: { lang: Locale } }) {
  const dictionary = await getDictionary(lang);
  const d = dictionary.services;

  const services = [
    { ...serviceData[0], content: d.seaFreight },
    { ...serviceData[1], content: d.airFreight },
    { ...serviceData[2], content: d.warehousing },
  ];

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-headline tracking-tight sm:text-5xl">{d.title}</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">{d.subtitle}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map(service => {
          const image = PlaceHolderImages.find(p => p.id === service.imageId);
          return (
            <Card key={service.id} className="flex flex-col">
              <CardHeader>
                {image && (
                  <div className="relative aspect-video overflow-hidden rounded-t-lg">
                    <Image
                      src={image.imageUrl}
                      alt={image.description}
                      fill
                      className="object-cover"
                      data-ai-hint={image.imageHint}
                    />
                  </div>
                )}
                <CardTitle className="pt-4 font-headline">{service.content.title}</CardTitle>
                <CardDescription>{service.content.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" /> {service.content.spec1}
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" /> {service.content.spec2}
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" /> {service.content.spec3}
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full" variant="secondary">
                  <Link href={`/${lang}/contact?service=${service.id}`}>{d.ctaButton}</Link>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
