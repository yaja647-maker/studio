'use client';

import { CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export function ContactForm({ dictionary }: { dictionary: any }) {
  const d = dictionary.contact;
  const services_d = dictionary.services;
  return (
    <CardContent>
      <form className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">{d.form.name}</Label>
          <Input id="name" placeholder="John Doe" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">{d.form.email}</Label>
          <Input id="email" type="email" placeholder="john.doe@example.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="subject">{d.form.subject}</Label>
          <Input id="subject" placeholder={services_d.ctaButton} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="message">{d.form.message}</Label>
          <Textarea id="message" placeholder="..." />
        </div>
        <Button type="submit" className="w-full" onClick={(e) => e.preventDefault()}>
          {d.form.submit}
        </Button>
      </form>
    </CardContent>
  );
}
