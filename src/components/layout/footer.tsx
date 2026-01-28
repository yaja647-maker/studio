import Link from 'next/link';
import Image from 'next/image';
import type { Locale } from '@/lib/i18n-config';

export function Footer({
  lang,
  dictionary,
}: {
  lang: Locale;
  dictionary: Record<string, string>;
}) {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="container mx-auto px-4 py-12 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex flex-col gap-4 md:col-span-1">
            <Link href={`/${lang}`} className="flex items-center gap-2 text-white">
                <Image src="/unnamed.png" alt="TRANSPORTESJADIANI Logo" width={150} height={32} className="h-8 w-auto" />
            </Link>
            <p className="text-sm max-w-xs">{dictionary.slogan}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">{dictionary.quickLinks}</h3>
            <ul className="space-y-2">
              <li><Link href={`/${lang}/about`} className="hover:text-primary transition-colors">{dictionary.about}</Link></li>
              <li><Link href={`/${lang}/services`} className="hover:text-primary transition-colors">{dictionary.services}</Link></li>
              <li><Link href={`/${lang}/tracking`} className="hover:text-primary transition-colors">{dictionary.tracking}</Link></li>
              <li><Link href={`/${lang}/contact`} className="hover:text-primary transition-colors">{dictionary.contact}</Link></li>
              <li><Link href={`/${lang}/blog`} className="hover:text-primary transition-colors">{dictionary.blog}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">{dictionary.legal}</h3>
            <ul className="space-y-2">
              <li><Link href={`/${lang}/legal`} className="hover:text-primary transition-colors">{dictionary.legalNotice}</Link></li>
              <li><Link href={`/${lang}/privacy`} className="hover:text-primary transition-colors">{dictionary.privacyPolicy}</Link></li>
              <li><Link href={`/${lang}/cookies`} className="hover:text-primary transition-colors">{dictionary.cookiesPolicy}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">{dictionary.contactUs}</h3>
            <address className="not-italic text-sm space-y-1">
              <p>Carrer de la Logística, 123</p>
              <p>08039 Barcelona, Espanya</p>
              <p className="pt-2">Email: <a href="mailto:contact@transportesjadiani.com" className="hover:text-primary transition-colors">contact@transportesjadiani.com</a></p>
              <p>Tel: <a href="tel:+34930123456" className="hover:text-primary transition-colors">+34 930 123 456</a></p>
            </address>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-8 text-center text-sm">
          <p>&copy; {currentYear} TRANSPORTESJADIANI. {dictionary.rightsReserved}</p>
        </div>
      </div>
    </footer>
  );
}
