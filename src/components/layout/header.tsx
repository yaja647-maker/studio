'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, LogIn } from 'lucide-react';

import type { Locale } from '@/lib/i18n-config';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import LanguageSwitcher from '@/components/lang-switcher';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface NavItem {
  href: string;
  label: string;
  authRequired?: boolean;
}

export function Header({
  lang,
  dictionary,
}: {
  lang: Locale;
  dictionary: Record<string, string>;
}) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // After component mounts on client, set isClient to true and check auth state
    setIsClient(true);
    const user = localStorage.getItem('user');
    setIsLoggedIn(!!user);
  }, [pathname]); // Re-run on path change for SPA navigation

  const navItems: NavItem[] = [
    { href: `/${lang}`, label: dictionary.home },
    { href: `/${lang}/services`, label: dictionary.services },
    { href: `/${lang}/tracking`, label: dictionary.tracking },
    { href: `/${lang}/about`, label: dictionary.about },
    { href: `/${lang}/blog`, label: dictionary.blog },
    { href: `/${lang}/contact`, label: dictionary.contact },
    { href: `/${lang}/documents`, label: dictionary.documents, authRequired: true },
  ];

  const visibleNavItems = navItems.filter(item => !item.authRequired || (isClient && isLoggedIn));

  return (
    <header className="bg-card shadow-sm sticky top-0 z-40 print:hidden">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Link href={`/${lang}`} className="flex items-center gap-2">
          <Image src="/icon.png" alt="TRANSPORTSJADIANI Logo" width={64} height={64} className="h-16 w-auto" />
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          {visibleNavItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                pathname.startsWith(item.href) && item.href !== `/${lang}` ? 'text-primary' : (pathname === `/${lang}` && item.href === `/${lang}`) ? 'text-primary' : 'text-foreground'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-4">
           {isClient ? (
             isLoggedIn ? (
               <Button asChild>
                  <Link href={`/${lang}/dashboard`}>{dictionary.dashboard}</Link>
               </Button>
             ) : (
               <Button asChild variant="outline">
                  <Link href={`/${lang}/login`}>
                    <LogIn className="mr-2 h-4 w-4" />
                    {dictionary.login}
                  </Link>
               </Button>
             )
           ) : (
             <Button variant="outline" disabled>
                <LogIn className="mr-2 h-4 w-4" />
                {dictionary.login}
             </Button>
           )}
           <LanguageSwitcher />
        </div>
        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="flex flex-col gap-6 p-6">
                <Link href={`/${lang}`} className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                  <Image src="/icon.png" alt="TRANSPORTSJADIANI Logo" width={64} height={64} className="h-12 w-auto" />
                </Link>
                <nav className="flex flex-col gap-4">
                  {visibleNavItems.map(item => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'text-lg font-medium transition-colors hover:text-primary',
                         pathname.startsWith(item.href) && item.href !== `/${lang}` ? 'text-primary' : (pathname === `/${lang}` && item.href === `/${lang}`) ? 'text-primary' : 'text-foreground'
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
                <div className="mt-auto flex flex-col gap-4">
                    {isClient ? (
                       isLoggedIn ? (
                         <Button asChild>
                            <Link href={`/${lang}/dashboard`} onClick={() => setIsMobileMenuOpen(false)}>{dictionary.dashboard}</Link>
                         </Button>
                       ) : (
                         <Button asChild>
                            <Link href={`/${lang}/login`} onClick={() => setIsMobileMenuOpen(false)}>{dictionary.login}</Link>
                         </Button>
                       )
                    ): (
                      <Button disabled>{dictionary.login}</Button>
                    )}
                    <LanguageSwitcher />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
