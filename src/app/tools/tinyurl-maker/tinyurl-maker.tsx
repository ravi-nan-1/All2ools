"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/use-language';
import { Loader2, Link, Copy, Check, QrCode, Download, Share2, Twitter, Mail, History, ExternalLink, BarChart2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';

interface ShortenedLink {
  longUrl: string;
  shortUrl: string;
  createdAt: string;
}

export function TinyUrlMaker() {
  const { toast } = useToast();
  const { translate } = useLanguage();
  const [longUrl, setLongUrl] = useState('');
  const [customSlug, setCustomSlug] = useState('');
  const [result, setResult] = useState<{ shortUrl: string; qrCode: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [history, setHistory] = useState<ShortenedLink[]>([]);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('tinyUrlHistory');
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Failed to parse history from localStorage", error);
    }
  }, []);

  const addToHistory = (longUrl: string, shortUrl: string) => {
    const newLink: ShortenedLink = { longUrl, shortUrl, createdAt: new Date().toISOString() };
    const updatedHistory = [newLink, ...history].slice(0, 5);
    setHistory(updatedHistory);
    try {
      localStorage.setItem('tinyUrlHistory', JSON.stringify(updatedHistory));
    } catch (error) {
      console.error("Failed to save history to localStorage", error);
    }
  };

  const shortenURL = async () => {
    if (!longUrl.trim()) {
      toast({
        title: 'URL is empty',
        description: 'Please enter a URL to shorten.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      new URL(longUrl);
    } catch (_) {
      toast({
        title: 'Invalid URL',
        description: 'Please enter a valid URL.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setResult(null);
    setIsCopied(false);

    // Placeholder function logic
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const slug = customSlug || Math.random().toString(36).substring(2, 8);
    const shortUrl = `https://all2ools.com/s/${slug}`;
    const qrCode = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(shortUrl)}`;

    setResult({ shortUrl, qrCode });
    addToHistory(longUrl, shortUrl);
    setIsLoading(false);
  };
  
  const copyShortURL = () => {
    if (result?.shortUrl) {
      navigator.clipboard.writeText(result.shortUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast({
        title: 'Copied to clipboard!',
        description: result.shortUrl,
      });
    }
  };

  const downloadQRCode = () => {
    if (result?.qrCode) {
      const link = document.createElement('a');
      link.href = result.qrCode;
      link.download = 'qrcode.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  
  const generateCustomSlug = () => {}; // Placeholder

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
      <div className="lg:col-span-3 space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="longUrl" className="text-sm font-medium">{translate('paste_long_url')}</label>
                <Input
                  id="longUrl"
                  type="url"
                  placeholder="https://example.com/very-long-url-to-shorten"
                  value={longUrl}
                  onChange={(e) => setLongUrl(e.target.value)}
                  className="mt-1 h-12 text-base"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label htmlFor="customSlug" className="text-sm font-medium">{translate('custom_slug_optional')}</label>
                <div className="relative mt-1">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground text-sm">all2ools.com/s/</span>
                  <Input
                    id="customSlug"
                    type="text"
                    placeholder="mybrand"
                    value={customSlug}
                    onChange={(e) => setCustomSlug(e.target.value)}
                    className="pl-32"
                    disabled={isLoading}
                  />
                </div>
              </div>
              <Button onClick={shortenURL} className="w-full h-12 text-lg" disabled={isLoading || !longUrl.trim()}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {translate('processing')}
                  </>
                ) : (
                  <>
                    <Link className="mr-2 h-5 w-5"/>
                    {translate('shorten_url')}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><History /> {translate('history')}</CardTitle>
            </CardHeader>
            <CardContent>
                {history.length > 0 ? (
                    <ul className="space-y-3">
                        {history.map((item, index) => (
                            <li key={index} className="flex justify-between items-center text-sm">
                                <span className="truncate text-muted-foreground">{item.longUrl}</span>
                                <a href={item.shortUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-4 whitespace-nowrap">{item.shortUrl.replace('https://', '')}</a>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-muted-foreground text-center text-sm">{translate('no_history')}</p>
                )}
            </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-2 space-y-6 sticky top-24">
        {result && !isLoading && (
          <div className="space-y-6">
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">{translate('your_short_link')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center bg-muted p-2 rounded-md">
                  <Input readOnly value={result.shortUrl} className="flex-grow bg-transparent border-none text-lg text-primary font-semibold"/>
                   <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={copyShortURL}>
                          {isCopied ? <Check className="text-green-500"/> : <Copy />}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{translate('copied')}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                 <div className="mt-4 flex gap-2">
                    <Button asChild variant="outline" className="flex-1">
                        <a href={result.shortUrl} target="_blank" rel="noopener noreferrer"><ExternalLink className="mr-2"/> Open</a>
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                         <Button variant="outline" className="flex-1"><Share2 className="mr-2"/> {translate('share_link')}</Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => window.open(`https://twitter.com/intent/tweet?text=Check%20out%20this%20link:%20${result.shortUrl}`, '_blank')}>
                            <Twitter className="mr-2"/> Twitter
                        </DropdownMenuItem>
                         <DropdownMenuItem onClick={() => window.location.href = `mailto:?subject=Shared%20Link&body=Check%20out%20this%20link:%20${result.shortUrl}`}>
                            <Mail className="mr-2"/> Email
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                </div>
              </CardContent>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2"><QrCode /> {translate('qr_code')}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-4">
                        <div className="p-2 border rounded-md bg-white">
                            <img src={result.qrCode} alt="QR Code" width={128} height={128} />
                        </div>
                        <Button variant="secondary" size="sm" className="w-full" onClick={downloadQRCode}>
                            <Download className="mr-2"/> {translate('download_qr')}
                        </Button>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2"><BarChart2 /> Analytics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">{translate('total_clicks')}</span>
                            <span className="font-bold">0</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">{translate('last_clicked')}</span>
                            <span className="font-bold">{translate('never')}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
          </div>
        )}
        {isLoading && (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8 rounded-lg bg-muted min-h-[300px]">
                <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                <p>Generating your short link...</p>
            </div>
        )}
         {!result && !isLoading && (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8 rounded-lg bg-muted min-h-[300px]">
                <Link className="h-12 w-12 mb-4 text-primary/50" />
                <p>Your shortened link and QR code will appear here.</p>
            </div>
        )}
      </div>
    </div>
  );
}
