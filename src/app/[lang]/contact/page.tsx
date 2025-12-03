import { getDictionary } from '@/lib/get-dictionary';
import { type Locale } from '@/lib/i18n-config';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin } from 'lucide-react';

export default async function ContactPage({ params: { lang } }: { params: { lang: Locale } }) {
  const dictionary = await getDictionary(lang);
  const d = dictionary.contact;
  const services_d = dictionary.services;

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-headline tracking-tight sm:text-5xl">{d.title}</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">{d.subtitle}</p>
      </div>

      <div className="grid md:grid-cols-5 gap-12">
        <div className="md:col-span-2 space-y-8">
          <h2 className="text-2xl font-bold font-headline">{d.infoTitle}</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <MapPin className="h-6 w-6 text-primary mt-1" />
              <div>
                <h3 className="font-semibold">{d.address}</h3>
                <p className="text-muted-foreground">{d.addressValue}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Mail className="h-6 w-6 text-primary mt-1" />
              <div>
                <h3 className="font-semibold">{d.email}</h3>
                <a href={`mailto:${d.emailValue}`} className="text-muted-foreground hover:text-primary transition-colors">
                  {d.emailValue}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Phone className="h-6 w-6 text-primary mt-1" />
              <div>
                <h3 className="font-semibold">{d.phone}</h3>
                <a href={`tel:${d.phoneValue.replace(/\s/g, '')}`} className="text-muted-foreground hover:text-primary transition-colors">
                  {d.phoneValue}
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="md:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">{d.form.submit}</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{d.form.name}</Label>
                  <Input id="name" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{d.form.email}</Label>
                  <Input id="email" type="email" placeholder="john.doe@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">{d.form.subject}</Label>
                  <Input id="subject" placeholder={services_d.ctaButton} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">{d.form.message}</Label>
                  <Textarea id="message" placeholder="..." />
                </div>
                <Button type="submit" className="w-full" onClick={(e) => e.preventDefault()}>
                  {d.form.submit}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
