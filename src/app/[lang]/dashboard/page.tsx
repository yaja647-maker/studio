'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Building, LogOut } from 'lucide-react';
import { type Locale } from '@/lib/i18n-config';

const getDictionary = (lang: Locale) =>
  import(`@/dictionaries/${lang}.json`).then(module => module.default);

export default function DashboardPage({ params }: { params: { lang: Locale } }) {
  const lang = use(params).lang;
  const [user, setUser] = useState<{ nom: string; empresa: string } | null>(null);
  const [dictionary, setDictionary] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    getDictionary(lang).then(setDictionary);

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      router.push(`/${lang}/login`);
    }
  }, [lang, router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push(`/${lang}/login`);
  };

  const getInitials = (name: string) => {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (!user || !dictionary) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="loader"></div>
        </div>
    );
  }
  
  const d = dictionary.dashboard;

  return (
    <section className="w-full bg-accent flex items-center py-12 md:py-16 min-h-[calc(100vh-13rem)]">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-primary">
                <AvatarFallback className="text-4xl bg-primary/20">{getInitials(user.nom)}</AvatarFallback>
              </Avatar>
              <CardTitle className="text-3xl font-headline">{d.title}</CardTitle>
              <CardDescription>{d.subtitle.replace('[NOM_USUARI]', user.nom)}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4 p-4 border rounded-lg">
                  <User className="h-6 w-6 text-primary" />
                  <div>
                      <p className="text-sm text-muted-foreground">{d.nameLabel}</p>
                      <p className="font-semibold">{user.nom}</p>
                  </div>
              </div>
              <div className="flex items-center gap-4 p-4 border rounded-lg">
                  <Building className="h-6 w-6 text-primary" />
                  <div>
                      <p className="text-sm text-muted-foreground">{d.companyLabel}</p>
                      <p className="font-semibold">{user.empresa}</p>
                  </div>
              </div>
               <Button onClick={handleLogout} variant="outline" className="w-full">
                <LogOut className="mr-2 h-4 w-4" />
                {d.logoutButton}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
