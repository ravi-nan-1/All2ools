"use client";

import { Button } from '@/components/ui/button';
import { Minimize, ExternalLink } from 'lucide-react';

export function ImageCompressor() {
  const toolUrl = '/image-compressor-app/out';

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-muted rounded-lg h-64">
      <Minimize className="h-12 w-12 text-primary mb-4" />
      <h3 className="text-xl font-semibold mb-2">Launch the Image Compressor</h3>
      <p className="text-muted-foreground max-w-sm mb-6">
        This powerful image compression tool runs in its own dedicated web application. Click below to open it.
      </p>
      <Button asChild size="lg">
        <a href={toolUrl} target="_blank" rel="noopener noreferrer">
          Launch Image Compressor
          <ExternalLink className="ml-2 h-4 w-4" />
        </a>
      </Button>
    </div>
  );
}
