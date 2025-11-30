"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Construction } from 'lucide-react';

export function AiInvoiceGenerator() {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-muted rounded-lg h-96">
      <Construction className="h-12 w-12 text-primary mb-4" />
      <h3 className="text-xl font-semibold mb-2">AI Invoice Generator Coming Soon</h3>
      <p className="text-muted-foreground max-w-sm">
        The interactive UI for this tool is currently under development. Please check back later!
      </p>
    </div>
  );
}
