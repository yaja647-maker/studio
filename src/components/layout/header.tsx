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
  const [activePath, setActivePath] = useState(pathname);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setActivePath(pathname);
    // Check localStorage only on client side
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      setIsLoggedIn(!!user);
    }
  }, [pathname]);

  const navItems: NavItem[] = [
    { href: `/${lang}`, label: dictionary.home },
    { href: `/${lang}/services`, label: dictionary.services },
    { href: `/${lang}/tracking`, label: dictionary.tracking },
    { href: `/${lang}/about`, label: dictionary.about },
    { href: `/${lang}/blog`, label: dictionary.blog },
    { href: `/${lang}/contact`, label: dictionary.contact },
  ];

  return (
    <header className="bg-card shadow-sm sticky top-0 z-40">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Link href={`/${lang}`} className="flex items-center gap-2">
          <Image src="/logo.png" alt="TransGlobal Solutions Logo" width={40} height={40} className="h-8 w-auto md:h-10" />
          <span className="text-xl md:text-2xl font-bold font-headline">
             <span className="text-primary">TransGlobal</span> Solutions
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                activePath.startsWith(item.href) && item.href !== `/${lang}` ? 'text-primary' : (activePath === `/${lang}` && item.href === `/${lang}`) ? 'text-primary' : 'text-foreground'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-4">
           {isLoggedIn ? (
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
                  <Image src="/logo.png" alt="TransGlobal Solutions Logo" width={40} height={40} className="h-8 w-auto" />
                  <span className="text-xl font-bold font-headline text-primary">TransGlobal</span>
                </Link>
                <nav className="flex flex-col gap-4">
                  {navItems.map(item => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'text-lg font-medium transition-colors hover:text-primary',
                         activePath.startsWith(item.href) && item.href !== `/${lang}` ? 'text-primary' : (activePath === `/${lang}` && item.href === `/${lang}`) ? 'text-primary' : 'text-foreground'
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
                <div className="mt-auto flex flex-col gap-4">
                    {isLoggedIn ? (
                       <Button asChild>
                          <Link href={`/${lang}/dashboard`} onClick={() => setIsMobileMenuOpen(false)}>{dictionary.dashboard}</Link>
                       </Button>
                     ) : (
                       <Button asChild>
                          <Link href={`/${lang}/login`} onClick={() => setIsMobileMenuOpen(false)}>{dictionary.login}</Link>
                       </Button>
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
