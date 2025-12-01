'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  UploadCloud,
  Image as ImageIcon,
  Loader2,
  Sparkles,
  Download,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { handleHeadshotGeneration } from '@/app/actions';

const styles = [
  {
    name: 'Corporate',
    prompt:
      'a professional corporate headshot, sharp focus, neutral background, studio lighting',
    imageHint: 'corporate headshot',
  },
  {
    name: 'Creative',
    prompt:
      'a creative, artistic headshot, textured background, dramatic lighting, vibrant colors',
    imageHint: 'creative portrait',
  },
  {
    name: 'Classic',
    prompt:
      'a classic black and white headshot, timeless, elegant, soft lighting, simple background',
    imageHint: 'classic portrait',
  },
  {
    name: 'Tech',
    prompt:
      'a modern tech-style headshot, clean, slightly blurred office or server room background, confident expression',
    imageHint: 'tech professional',
  },
];

export function AiHeadshotGenerator() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string>('');
  const [generatedUrl, setGeneratedUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [selectedStyle, setSelectedStyle] = useState<string>(styles[0].prompt);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/') && file.size < 4 * 1024 * 1024) {
        setOriginalFile(file);
        setOriginalUrl(URL.createObjectURL(file));
        setGeneratedUrl('');
      } else {
        toast({
          title: 'Invalid File',
          description:
            'Please select a valid image file under 4MB.',
          variant: 'destructive',
        });
        setOriginalFile(null);
        setOriginalUrl('');
      }
    }
  };

  const handleGenerate = async () => {
    if (!originalFile) {
      toast({
        title: 'No Image Selected',
        description: 'Please upload a selfie first.',
        variant: 'destructive',
      });
      return;
    }
    setIsGenerating(true);
    setGeneratedUrl('');

    const formData = new FormData();
    formData.append('image', originalFile);
    formData.append('style', selectedStyle);

    try {
      const result = await handleHeadshotGeneration(formData);
      if (result.error) {
        throw new Error(result.error);
      }
      setGeneratedUrl(result.generatedHeadshotDataUri as string);
      toast({
        title: 'Headshot Generated!',
        description: 'Your new professional headshot is ready.',
      });
    } catch (error: any) {
      toast({
        title: 'Generation Failed',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (generatedUrl) {
      const link = document.createElement('a');
      link.href = generatedUrl;
      link.download = 'ai_headshot.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Side: Upload and Style Selection */}
        <div className="space-y-6">
          <div>
            <label
              htmlFor="image-upload"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-background transition-colors"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                {originalUrl ? (
                  <img
                    src={originalUrl}
                    alt="Uploaded selfie"
                    className="max-h-full max-w-full object-contain rounded-md"
                  />
                ) : (
                  <>
                    <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop your selfie
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG, WEBP (Max 4MB)
                    </p>
                  </>
                )}
              </div>
              <Input
                id="image-upload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isGenerating}
              />
            </label>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Choose a Style</h3>
            <div className="grid grid-cols-2 gap-4">
              {styles.map((style) => (
                <Card
                  key={style.name}
                  onClick={() => setSelectedStyle(style.prompt)}
                  className={cn(
                    'cursor-pointer transition-all',
                    selectedStyle === style.prompt
                      ? 'border-primary ring-2 ring-primary'
                      : 'hover:border-primary/50'
                  )}
                >
                  <CardContent className="p-4 text-center">
                    <p className="font-semibold">{style.name}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Generation and Result */}
        <div className="space-y-4 text-center">
          <Button
            onClick={handleGenerate}
            disabled={!originalFile || isGenerating}
            className="w-full h-12 text-lg"
          >
            {isGenerating ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-5 w-5" />
            )}
            Generate Headshot
          </Button>
          <div className="bg-muted aspect-square rounded-lg flex items-center justify-center overflow-hidden border">
            {isGenerating && (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p>Generating your headshot...</p>
                <p className="text-sm">(This may take up to 30 seconds)</p>
              </div>
            )}
            {!isGenerating && generatedUrl ? (
              <img
                src={generatedUrl}
                alt="Generated headshot"
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              !isGenerating && (
                <ImageIcon className="h-24 w-24 text-muted-foreground" />
              )
            )}
          </div>
          {generatedUrl && !isGenerating && (
            <Button onClick={handleDownload} className="w-full">
              <Download className="mr-2 h-5 w-5" />
              Download Headshot
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
