'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Search, MapPin, Package, Calendar, Ship } from 'lucide-react';
import { type Locale } from '@/lib/i18n-config';

type Shipment = {
  tracking_code: string;
  origen: string;
  desti: string;
  eta: string;
  ubicacio_actual: string;
  estat: 'En magatzem' | 'En trànsit' | 'Lliurat';
};

const mockShipments: Shipment[] = [
  {
    tracking_code: 'TRK-001',
    origen: 'Shenzhen',
    desti: 'València',
    eta: '20/10/2025',
    ubicacio_actual: 'Port de València',
    estat: 'En magatzem',
  },
  {
    tracking_code: 'TRK-002',
    origen: 'Hamburg',
    desti: 'Algesires',
    eta: '05/11/2025',
    ubicacio_actual: 'Estret de Gibraltar',
    estat: 'En trànsit',
  },
  {
    tracking_code: 'TRK-003',
    origen: 'Los Angeles',
    desti: 'Tarragona',
    eta: '01/12/2025',
    ubicacio_actual: 'Magatzem central, Tarragona',
    estat: 'Lliurat',
  },
  {
    tracking_code: 'TRK-004',
    origen: 'Xangai',
    desti: 'Barcelona',
    eta: '15/12/2025',
    ubicacio_actual: 'Carrer de la Marina, Barcelona',
    estat: 'Lliurat',
  },
  {
    tracking_code: 'TRK-005',
    origen: 'Singapur',
    desti: 'Bilbao',
    eta: '28/11/2025',
    ubicacio_actual: 'Golf de Biscaia',
    estat: 'En trànsit',
  },
];

// Lazy load getDictionary
const getDictionary = (lang: Locale) =>
  import(`@/dictionaries/${lang}.json`).then(module => module.default);


export default function TrackingPage({ params: { lang } }: { params: { lang: Locale } }) {
  const [trackingCode, setTrackingCode] = useState('');
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dictionary, setDictionary] = useState<any>(null);

  useEffect(() => {
    getDictionary(lang).then(setDictionary);
  }, [lang]);

  const handleSearch = () => {
    if (!trackingCode) return;
    setIsLoading(true);
    setError(null);
    setShipment(null);

    setTimeout(() => {
      const foundShipment = mockShipments.find(s => s.tracking_code.toLowerCase() === trackingCode.toLowerCase());
      
      if (foundShipment) {
        setShipment(foundShipment);
      } else {
        setError(dictionary.tracking.notFound);
      }
      setIsLoading(false);
    }, 500);
  };

  const getProgressProps = (status: Shipment['estat']): { value: number; colorClass: string; label: string } => {
    if (!dictionary) return { value: 0, colorClass: '', label: '' };
    switch (status) {
      case 'En magatzem':
        return { value: 10, colorClass: 'bg-orange-500', label: dictionary.tracking.statusWarehouse };
      case 'En trànsit':
        return { value: 50, colorClass: 'bg-blue-500', label: dictionary.tracking.statusTransit };
      case 'Lliurat':
        return { value: 100, colorClass: 'bg-green-500', label: dictionary.tracking.statusDelivered };
      default:
        return { value: 0, colorClass: 'bg-gray-500', label: dictionary.tracking.statusUnknown };
    }
  };
  
  if (!dictionary) return null;
  const d = dictionary.tracking;

  const progressProps = shipment ? getProgressProps(shipment.estat) : null;
  
  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-16">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold font-headline tracking-tight sm:text-5xl">{d.title}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{d.subtitle}</p>
        </div>
        
        <div className="flex gap-2 mb-8">
          <Input 
            type="text"
            value={trackingCode}
            onChange={(e) => setTrackingCode(e.target.value)}
            placeholder={d.inputPlaceholder}
            className="flex-grow"
            onKeyUp={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button onClick={handleSearch} disabled={isLoading}>
            <Search className="mr-2" />
            {isLoading ? d.searching : d.searchButton}
          </Button>
        </div>

        {error && (
            <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        {shipment && (
          <Card className="w-full animate-in fade-in-50">
            <CardHeader>
              <CardTitle className="flex items-center justify-between font-headline">
                <span>{d.resultsTitle}: {shipment.tracking_code}</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium text-white ${progressProps?.colorClass}`}>
                  {progressProps?.label}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Progress value={progressProps?.value} className={`[&>*]:bg-primary`} />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>{d.statusWarehouse}</span>
                    <span>{d.statusTransit}</span>
                    <span>{d.statusDelivered}</span>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-start gap-3">
                  <Package className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="font-semibold">{d.origin}</p>
                    <p className="text-muted-foreground">{shipment.origen}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Ship className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="font-semibold">{d.destination}</p>
                    <p className="text-muted-foreground">{shipment.desti}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="font-semibold">{d.eta}</p>
                    <p className="text-muted-foreground">{shipment.eta}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="font-semibold">{d.currentLocation}</p>
                    <p className="text-muted-foreground">{shipment.ubicacio_actual}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
