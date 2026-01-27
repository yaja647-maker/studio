'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { type Locale } from '@/lib/i18n-config';
import Link from 'next/link';

type User = {
  usuari: string;
  nom: string;
  empresa: string;
};

const API_URL = 'https://sheetdb.io/api/v1/b3co8gke4ph6w';

const getDictionary = (lang: Locale) =>
  import(`@/dictionaries/${lang}.json`).then(module => module.default);

export default function LoginPage({ params }: { params: { lang: Locale } }) {
  const lang = use(params).lang;
  const [usuari, setUsuari] = useState('');
  const [contrasenya, setContrasenya] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dictionary, setDictionary] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    getDictionary(lang).then(setDictionary);
  }, [lang]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!usuari || !contrasenya) {
      setError(dictionary.login.fillFields);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/search?sheet=usuaris&usuari=${encodeURIComponent(usuari)}&contrasenya=${encodeURIComponent(contrasenya)}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data: User[] = await response.json();

      if (data.length > 0) {
        const user = data[0];
        localStorage.setItem('user', JSON.stringify({ nom: user.nom, empresa: user.empresa }));
        router.push(`/${lang}/dashboard`);
      } else {
        setError(dictionary.login.incorrectData);
      }
    } catch (e) {
      console.error(e);
      setError(dictionary.login.loginError);
    } finally {
      setIsLoading(false);
    }
  };

  if (!dictionary) return null; // Or a loading spinner
  const d = dictionary.login;

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-13rem)] bg-accent p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">{d.title}</CardTitle>
          <CardDescription>{d.subtitle}</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">{d.userLabel}</Label>
              <Input
                id="username"
                type="text"
                placeholder={d.userPlaceholder}
                value={usuari}
                onChange={(e) => setUsuari(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{d.passwordLabel}</Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                value={contrasenya}
                onChange={(e) => setContrasenya(e.target.value)}
                required
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? d.loggingIn : d.loginButton}
            </Button>
            <Button variant="link" asChild>
                <Link href={`/${lang}`}>{d.backToHome}</Link>
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
