'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Sparkles, Upload } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { enhanceImageAction } from '@/app/actions';

export function ImageEnhancer({ dictionary }: { dictionary: any }) {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
        toast({
          variant: 'destructive',
          title: dictionary.error,
          description: dictionary.fileTooLarge,
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setOriginalImage(reader.result as string);
        setEnhancedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEnhanceImage = async () => {
    if (!originalImage) return;

    setIsLoading(true);
    setEnhancedImage(null);

    const result = await enhanceImageAction(originalImage);

    if (result.success && result.data) {
      setEnhancedImage(result.data);
    } else {
      toast({
        variant: 'destructive',
        title: dictionary.error,
        description: result.error || dictionary.enhancementFailed,
      });
    }
    setIsLoading(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <Sparkles className="text-primary" />
          {dictionary.title}
        </CardTitle>
        <CardDescription>{dictionary.uploadDescription}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="image-upload">{dictionary.uploadLabel}</Label>
          <div className="flex items-center gap-4">
            <Input id="image-upload" type="file" accept="image/png, image/jpeg" onChange={handleFileChange} className="max-w-sm" />
            <Button onClick={handleEnhanceImage} disabled={!originalImage || isLoading}>
              <Upload className="mr-2 h-4 w-4" />
              {isLoading ? dictionary.enhancing : dictionary.enhanceButton}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold font-headline">{dictionary.originalTitle}</h3>
            <div className="aspect-video border rounded-lg overflow-hidden flex items-center justify-center bg-muted/50">
              {originalImage ? (
                <Image src={originalImage} alt="Original" width={600} height={400} className="object-contain w-full h-full" />
              ) : (
                <p className="text-muted-foreground">{dictionary.originalPlaceholder}</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold font-headline">{dictionary.enhancedTitle}</h3>
            <div className="aspect-video border rounded-lg overflow-hidden flex items-center justify-center bg-muted/50">
              {isLoading && <Skeleton className="w-full h-full" />}
              {!isLoading && enhancedImage && (
                <Image src={enhancedImage} alt="Enhanced" width={600} height={400} className="object-contain w-full h-full" />
              )}
              {!isLoading && !enhancedImage && (
                <p className="text-muted-foreground">{dictionary.enhancedPlaceholder}</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
