import Image from 'next/image';
import Link from 'next/link';
import { getDictionary } from '@/lib/get-dictionary';
import { type Locale } from '@/lib/i18n-config';
import { ImageEnhancer } from '@/components/image-enhancer';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, User } from 'lucide-react';

export default async function BlogPage({ params: { lang } }: { params: { lang: Locale } }) {
  const dictionary = await getDictionary(lang);
  const d = dictionary.blog;

  return (
    <section className="w-full bg-accent py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold font-headline tracking-tight sm:text-5xl">{d.title}</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">{d.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {(d.posts || []).map((post: any) => {
            const image = PlaceHolderImages.find(p => p.id === post.imageId);
            return (
              <Card key={post.id} className="flex flex-col overflow-hidden">
                <CardHeader className="p-0">
                  {image && (
                    <Link href="#" className="block relative aspect-video overflow-hidden">
                      <Image
                        src={image.imageUrl}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-300 hover:scale-105"
                        data-ai-hint={image.imageHint}
                      />
                    </Link>
                  )}
                </CardHeader>
                <CardContent className="flex-grow p-6">
                  <CardTitle className="font-headline text-xl mb-2">
                    <Link href="#" className="hover:text-primary transition-colors">{post.title}</Link>
                  </CardTitle>
                  <div className="flex items-center text-xs text-muted-foreground mb-3 space-x-4">
                      <div className="flex items-center gap-1.5">
                          <User className="h-3 w-3" />
                          <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                          <Calendar className="h-3 w-3" />
                          <span>{post.date}</span>
                      </div>
                  </div>
                  <CardDescription>{post.excerpt}</CardDescription>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <Button asChild variant="secondary" className="w-full">
                    <Link href="#">{post.cta}</Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
        
        <div className="mt-24">
            <ImageEnhancer dictionary={dictionary.imageEnhancer} />
        </div>

      </div>
    </section>
  );
}
