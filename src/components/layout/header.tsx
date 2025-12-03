'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, Ship } from 'lucide-react';

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

  useEffect(() => {
    setActivePath(pathname);
  }, [pathname]);

  const navItems: NavItem[] = [
    { href: `/${lang}`, label: dictionary.home },
    { href: `/${lang}/services`, label: dictionary.services },
    { href: `/${lang}/about`, label: dictionary.about },
    { href: `/${lang}/blog`, label: dictionary.blog },
    { href: `/${lang}/contact`, label: dictionary.contact },
  ];

  return (
    <header className="bg-card shadow-sm sticky top-0 z-40">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Link href={`/${lang}`} className="flex items-center gap-2">
          <Ship className="h-8 w-8 text-primary" />
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
                activePath === item.href ? 'text-primary' : 'text-foreground'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-4">
           <Button asChild>
              <Link href={`/${lang}/contact`}>{dictionary.quote}</Link>
           </Button>
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
                  <Ship className="h-8 w-8 text-primary" />
                  <span className="text-xl font-bold font-headline text-primary">TransGlobal</span>
                </Link>
                <nav className="flex flex-col gap-4">
                  {navItems.map(item => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'text-lg font-medium transition-colors hover:text-primary',
                         activePath === item.href ? 'text-primary' : 'text-foreground'
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
                <div className="mt-auto flex flex-col gap-4">
                    <Button asChild>
                        <Link href={`/${lang}/contact`} onClick={() => setIsMobileMenuOpen(false)}>{dictionary.quote}</Link>
                    </Button>
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
