'use client';

import { useState, useEffect, useMemo, use } from 'react';
import { useRouter } from 'next/navigation';
import { type Locale } from '@/lib/i18n-config';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { Loader2, FileText, Printer, ArrowLeft } from 'lucide-react';
import Image from 'next/image';

const getDictionary = (lang: Locale) =>
  import(`@/dictionaries/${lang}.json`).then(module => module.default);

type UserData = {
  usuari: string;
  rol: string;
  empresa: string;
  fiscalid: string;
  adreca: string;
  telefon: string;
};

type DocumentLine = {
  id: string;
  num_factura: string;
  data: string;
  usuari: string;
  fpagament: string;
  concepte: string;
  preu_unitari: string;
  unitats: string;
  iva: string;
  dte: string;
  albara: string;
};

type AggregatedInvoice = {
  invoiceNumber: string;
  date: string;
  paymentMethod: string;
  clientData: UserData;
  lines: DocumentLine[];
  totals: {
    base: number;
    vatDetails: { rate: number; base: number; amount: number }[];
    totalVat: number;
    finalTotal: number;
  };
};

const API_URL = 'https://sheetdb.io/api/v1/b3co8gke4ph6w';

export default function DocumentsPage({ params }: { params: { lang: Locale } }) {
  const lang = use(params).lang;
  const [dictionary, setDictionary] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<{ usuari: string; nom: string; empresa: string } | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [invoices, setInvoices] = useState<Map<string, AggregatedInvoice>>(new Map());
  const [selectedInvoice, setSelectedInvoice] = useState<AggregatedInvoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    getDictionary(lang).then(setDictionary);
  }, [lang]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push(`/${lang}/login`);
    } else {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, [lang, router]);

  useEffect(() => {
    if (!currentUser || !dictionary) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [usersRes, documentsRes] = await Promise.all([
          fetch(`${API_URL}?sheet=usuaris`),
          fetch(`${API_URL}?sheet=documents`),
        ]);

        if (!usersRes.ok || !documentsRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const usersData: UserData[] = await usersRes.json();
        const documentsData: DocumentLine[] = await documentsRes.json();

        const currentUserData = usersData.find(u => u.usuari === currentUser.usuari);
        const role = currentUserData?.rol?.trim().toLowerCase() ?? 'client';
        setUserRole(role);

        const isAdmin = ['admin', 'administrador', 'treballador'].includes(role);
        
        const filteredDocuments = isAdmin 
          ? documentsData 
          : documentsData.filter(d => d.usuari === currentUser.usuari);
        
        processInvoices(filteredDocuments, usersData);

      } catch (err) {
        setError(dictionary.documents.error);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentUser, dictionary]);

  const processInvoices = (documents: DocumentLine[], users: UserData[]) => {
    const groupedInvoices = new Map<string, DocumentLine[]>();
    for (const doc of documents) {
      if (!doc.num_factura || doc.num_factura.trim() === '') continue;
      const group = groupedInvoices.get(doc.num_factura) ?? [];
      group.push(doc);
      groupedInvoices.set(doc.num_factura, group);
    }
    
    const aggregated = new Map<string, AggregatedInvoice>();
    for (const [invoiceNumber, lines] of groupedInvoices.entries()) {
      const firstLine = lines[0];
      let clientData = users.find(u => u.usuari === firstLine.usuari);

      if (!clientData) {
        clientData = {
          usuari: firstLine.usuari || 'N/A',
          rol: 'client',
          empresa: firstLine.usuari || dictionary?.documents?.unknownClient || 'Client desconegut',
          fiscalid: 'N/A',
          adreca: 'N/A',
          telefon: 'N/A',
        };
      }

      let base = 0;
      const vatMap = new Map<number, { base: number; amount: number }>();

      lines.forEach(line => {
        const price = parseFloat(line.preu_unitari) || 0;
        const units = parseFloat(line.unitats) || 0;
        const discount = parseFloat(line.dte) || 0;
        const vatRate = parseFloat(line.iva) || 0;

        const netLineTotal = (price * units) * (1 - discount / 100);
        base += netLineTotal;
        
        const vatAmount = netLineTotal * (vatRate / 100);

        const currentVat = vatMap.get(vatRate) ?? { base: 0, amount: 0 };
        vatMap.set(vatRate, {
          base: currentVat.base + netLineTotal,
          amount: currentVat.amount + vatAmount,
        });
      });

      const vatDetails = Array.from(vatMap.entries()).map(([rate, data]) => ({ rate, ...data }));
      const totalVat = vatDetails.reduce((sum, item) => sum + item.amount, 0);
      const finalTotal = base + totalVat;

      aggregated.set(invoiceNumber, {
        invoiceNumber,
        date: firstLine.data,
        paymentMethod: firstLine.fpagament,
        clientData,
        lines,
        totals: { base, vatDetails, totalVat, finalTotal },
      });
    }
    setInvoices(aggregated);
  };
  
  const sortedInvoices = useMemo(() => {
    return Array.from(invoices.values()).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [invoices]);


  const handlePrint = () => {
    window.print();
  };

  const d = dictionary?.documents;

  if (isLoading || !d) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-13rem)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-4 text-muted-foreground">{d?.loading || 'Carregant...'}</p>
      </div>
    );
  }
  
  if (error) {
     return <div className="text-center py-10 text-destructive">{error}</div>
  }

  if (selectedInvoice) {
    const invoice = selectedInvoice;
    return (
      <div className="bg-accent py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-4 print:hidden">
            <Button variant="outline" onClick={() => setSelectedInvoice(null)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {d.back}
            </Button>
            <Button onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              {d.print}
            </Button>
          </div>

          <Card id="zona-factura" className="w-full p-8 print:shadow-none print:border-none">
            <CardHeader className="p-0 mb-8">
              <div className="flex justify-between items-start">
                <div>
                  <Image src="/icon.png" alt="TRANSPORTSJADIANI Logo" width={100} height={100} />
                  <h2 className="font-bold text-lg mt-2">TRANSPORTSJADIANI</h2>
                  <p className="text-sm text-muted-foreground">Carrer de la Logística, 123<br />08039 Barcelona, Espanya</p>
                </div>
                <div className="text-right">
                  <CardTitle className="text-3xl font-headline mb-2">{d.invoice.toUpperCase()}</CardTitle>
                  <p><strong># {invoice.invoiceNumber}</strong></p>
                  <p>{d.date}: {new Date(invoice.date).toLocaleDateString(lang)}</p>
                </div>
              </div>
              <Separator className="my-6"/>
              <div className="text-sm">
                <h3 className="font-semibold mb-2">{d.clientData}</h3>
                <p className="font-bold">{invoice.clientData.empresa}</p>
                <p>{invoice.clientData.adreca}</p>
                <p>{d.fiscalId}: {invoice.clientData.fiscalid}</p>
                <p>{d.phone}: {invoice.clientData.telefon}</p>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-2/4">{d.concept}</TableHead>
                    <TableHead className="text-right">{d.price}</TableHead>
                    <TableHead className="text-right">{d.units}</TableHead>
                    <TableHead className="text-right">{d.discount}</TableHead>
                    <TableHead className="text-right">{d.vat} (%)</TableHead>
                    <TableHead className="text-right">{d.net}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoice.lines.map((line, index) => {
                    const price = parseFloat(line.preu_unitari) || 0;
                    const units = parseFloat(line.unitats) || 0;
                    const discount = parseFloat(line.dte) || 0;
                    const netLineTotal = (price * units) * (1 - discount / 100);
                    return (
                      <TableRow key={index}>
                        <TableCell>{line.concepte}</TableCell>
                        <TableCell className="text-right">{price.toFixed(2)} €</TableCell>
                        <TableCell className="text-right">{units}</TableCell>
                        <TableCell className="text-right">{discount.toFixed(2)} %</TableCell>
                        <TableCell className="text-right">{line.iva} %</TableCell>
                        <TableCell className="text-right">{netLineTotal.toFixed(2)} €</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
              <Separator className="my-6"/>
              <div className="flex justify-end">
                  <div className="w-full max-w-sm space-y-2 text-sm">
                      <div className="flex justify-between">
                          <span>{d.base}</span>
                          <span>{invoice.totals.base.toFixed(2)} €</span>
                      </div>
                      {invoice.totals.vatDetails.map(vat => (
                           <div key={vat.rate} className="flex justify-between">
                              <span>{d.vat} {vat.rate}% ({vat.base.toFixed(2)} €)</span>
                              <span>{vat.amount.toFixed(2)} €</span>
                          </div>
                      ))}
                      <Separator />
                      <div className="flex justify-between font-bold text-lg">
                          <span>{d.total}</span>
                          <span>{invoice.totals.finalTotal.toFixed(2)} €</span>
                      </div>
                  </div>
              </div>
               <Separator className="my-6"/>
              <div className="text-sm space-y-2">
                  <p><strong>{d.paymentMethod}:</strong> {invoice.paymentMethod}</p>
              </div>
            </CardContent>
            <CardFooter className="p-0 mt-8 pt-4 border-t">
               <p className="text-xs text-muted-foreground">{d.legalNotice}</p>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  const isAdminView = ['admin', 'administrador', 'treballador'].includes(userRole ?? '');

  return (
    <section className="w-full bg-accent min-h-[calc(100vh-13rem)] py-12">
        <div className="container mx-auto px-4">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold font-headline tracking-tight sm:text-5xl">{isAdminView ? d.adminTitle : d.title}</h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">{isAdminView ? d.adminSubtitle : d.subtitle}</p>
            </div>
            
            {sortedInvoices.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {sortedInvoices.map(invoice => (
                        <Card key={invoice.invoiceNumber} className="flex flex-col">
                            <CardHeader>
                                <CardTitle className="flex items-start justify-between">
                                    <span className="font-headline">{d.invoice} #{invoice.invoiceNumber}</span>
                                    <FileText className="h-6 w-6 text-primary" />
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex-grow space-y-2 text-sm">
                                <p><strong>{d.date}:</strong> {new Date(invoice.date).toLocaleDateString(lang)}</p>
                                <p><strong>{d.client}:</strong> {invoice.clientData.empresa}</p>
                                <p className="text-lg font-semibold pt-2">{invoice.totals.finalTotal.toFixed(2)} €</p>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full" onClick={() => setSelectedInvoice(invoice)}>
                                    {d.view}
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-10">
                    <p className="text-muted-foreground">{d.noInvoices}</p>
                </div>
            )}
        </div>
    </section>
  );
}
