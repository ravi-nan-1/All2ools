"use client";
import { useState } from 'react';
import imageCompression from 'browser-image-compression';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, UploadCloud, Download, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CompressedResult {
  file: File;
  url: string;
  originalSize: number;
  compressedSize: number;
}

export function ImageCompressor() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string>('');
  const [compressedResult, setCompressedResult] = useState<CompressedResult | null>(null);
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setOriginalFile(file);
        setOriginalUrl(URL.createObjectURL(file));
        setCompressedResult(null);
        setError('');
      } else {
        setError('Please select a valid image file.');
        toast({
            title: 'Invalid File',
            description: 'Please select a valid image file.',
            variant: 'destructive',
        });
        setOriginalFile(null);
        setOriginalUrl('');
      }
    }
  };

  const handleCompress = async () => {
    if (!originalFile) {
      setError('Please select an image first.');
      toast({
        title: 'No Image Selected',
        description: 'Please select an image first.',
        variant: 'destructive',
      });
      return;
    }
    setIsCompressing(true);
    setError('');
    setCompressedResult(null);

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(originalFile, options);
      const compressedUrl = URL.createObjectURL(compressedFile);

      setCompressedResult({
        file: compressedFile,
        url: compressedUrl,
        originalSize: originalFile.size,
        compressedSize: compressedFile.size,
      });
       toast({
        title: 'Compression Successful',
        description: 'Your image has been compressed.',
      });
    } catch (compressionError) {
      console.error('Compression error:', compressionError);
      setError('Failed to compress image. Please try a different file.');
      toast({
        title: 'Compression Failed',
        description: 'Failed to compress image. Please try a different file.',
        variant: 'destructive',
      });
    } finally {
      setIsCompressing(false);
    }
  };

  const handleDownload = () => {
    if (compressedResult) {
      const link = document.createElement('a');
      link.href = compressedResult.url;
      link.download = `compressed_${compressedResult.file.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
        <div className="space-y-6">
            <div className="flex flex-col items-center justify-center w-full">
              <label htmlFor="image-upload" className="flex flex-col items-center justify-center w-full h-48 sm:h-64 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-background transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                  <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
                  {originalFile ? (
                    <p className="font-semibold text-primary break-all px-2">{originalFile.name}</p>
                  ) : (
                    <>
                      <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                      <p className="text-xs text-muted-foreground">PNG, JPG, WEBP, GIF</p>
                    </>
                  )}
                </div>
                <Input id="image-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </label>
            </div>

            {error && <p className="text-sm font-medium text-destructive text-center">{error}</p>}

            <Button onClick={handleCompress} disabled={!originalFile || isCompressing} className="w-full h-12 text-lg">
              {isCompressing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Compressing...
                </>
              ) : 'Compress Image'}
            </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="space-y-4 text-center">
            <h3 className="text-xl font-semibold">Original Image</h3>
            <div className="bg-muted aspect-video rounded-lg flex items-center justify-center overflow-hidden border">
              {originalUrl ? <img src={originalUrl} alt="Original" className="max-h-full max-w-full object-contain" /> : <ImageIcon className="h-16 w-16 text-muted-foreground" />}
            </div>
            {originalFile && <p className="text-muted-foreground">Size: {formatBytes(originalFile.size)}</p>}
          </div>

          <div className="space-y-4 text-center">
            <h3 className="text-xl font-semibold">Compressed Image</h3>
            <div className="bg-muted aspect-video rounded-lg flex items-center justify-center overflow-hidden border">
              {isCompressing && <Loader2 className="h-12 w-12 animate-spin text-primary" />}
              {!isCompressing && compressedResult ? <img src={compressedResult.url} alt="Compressed" className="max-h-full max-w-full object-contain" /> : !isCompressing && <ImageIcon className="h-16 w-16 text-muted-foreground" />}
            </div>
            {compressedResult && (
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  New Size: {formatBytes(compressedResult.compressedSize)} | Reduction: {(((compressedResult.originalSize - compressedResult.compressedSize) / compressedResult.originalSize) * 100).toFixed(2)}%
                </p>
                <Button onClick={handleDownload} className="w-full">
                  <Download className="mr-2 h-5 w-5" />
                  Download Compressed Image
                </Button>
              </div>
            )}
          </div>
        </div>
    </div>
  );
}
