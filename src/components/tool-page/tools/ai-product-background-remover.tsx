"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { handleBackgroundRemoval } from '@/app/actions';
import { useLanguage } from '@/hooks/use-language';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function AiProductBackgroundRemover() {
  const { toast } = useToast();
  const { translate } = useLanguage();
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setOriginalImage(reader.result as string);
        setProcessedImage(null);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      toast({
        title: 'No file selected',
        description: 'Please upload an image first.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    setProcessedImage(null);

    const formData = new FormData();
    formData.append('image', file);
    
    try {
      const result = await handleBackgroundRemoval(formData);
      if (result.error) {
        throw new Error(result.error);
      }
      setProcessedImage(result.backgroundRemovedPhotoDataUri as string);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast({
        title: 'Error processing image',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="space-y-4">
      <p className="text-muted-foreground">
        {translate('upload_image_and_remove_bg')}
      </p>
      <form onSubmit={handleSubmit} className="flex items-center gap-4">
        <Input type="file" accept="image/*" onChange={handleFileChange} className="flex-grow" />
        <Button type="submit" disabled={isLoading || !file}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {translate('processing')}
            </>
          ) : (
            translate('upload_image')
          )}
        </Button>
      </form>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2 text-center">Original</h3>
            <div className="aspect-square relative bg-muted rounded-md flex items-center justify-center">
              {originalImage ? (
                <Image src={originalImage} alt="Original" fill className="object-contain" />
              ) : <p className="text-sm text-muted-foreground">Upload an image to see it here</p>}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2 text-center">Result</h3>
            <div className="aspect-square relative bg-muted rounded-md flex items-center justify-center">
              {isLoading && <Loader2 className="h-8 w-8 animate-spin text-primary" />}
              {processedImage && !isLoading && (
                <Image src={processedImage} alt="Background removed" fill className="object-contain" />
              )}
               {!processedImage && !isLoading && <p className="text-sm text-muted-foreground">Result will appear here</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
