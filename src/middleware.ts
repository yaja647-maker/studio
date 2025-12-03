import { NextRequest, NextResponse } from 'next/server';
import { i18n } from '@/lib/i18n-config';
import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

function getLocale(request: NextRequest): string | undefined {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  // @ts-ignore locales are readonly
  const locales: string[] = i18n.locales;
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  const defaultLocale = i18n.defaultLocale;

  try {
    return matchLocale(languages, locales, defaultLocale);
  } catch (e) {
    console.warn(`Could not match locale for languages ${languages.join(', ')}`);
    return defaultLocale;
  }
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip middleware for static files and specific paths
  if (
    [
      '/manifest.json',
      '/favicon.ico',
    ].includes(pathname) || pathname.startsWith('/images/')
  ) {
    return;
  }

  const pathnameIsMissingLocale = i18n.locales.every(
    locale => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    
    // Prepend the locale to the path
    return NextResponse.redirect(
      new URL(`/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`, request.url)
    );
  }
}

export const config = {
  // Matcher ignoring `api`, `_next/static`, `_next/image`, and asset files
  matcher: ['/((?!api|_next/static|_next/image|.*\\..*).*)'],
};
