"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { handleLatencyCheck } from '@/app/actions';
import { useLanguage } from '@/hooks/use-language';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface LatencyResult {
  region: string;
  latency: number | string;
}

export function ApiLatencyChecker() {
  const { toast } = useToast();
  const { translate } = useLanguage();
  const [url, setUrl] = useState('');
  const [results, setResults] = useState<LatencyResult[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!url.trim()) {
      toast({
        title: 'URL is empty',
        description: 'Please enter a URL to check.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    setResults(null);

    const formData = new FormData();
    formData.append('url', url);
    
    try {
      const latencyResults = await handleLatencyCheck(formData);
      if (latencyResults.error) {
        throw new Error(latencyResults.error);
      }
      setResults(latencyResults.data as LatencyResult[]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast({
        title: 'Error checking latency',
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
        {translate('check_api_latency')}
      </p>
      <form onSubmit={handleSubmit} className="flex items-center gap-4">
        <Input
          type="url"
          placeholder="https://api.example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-grow"
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading || !url.trim()}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {translate('processing')}
            </>
          ) : (
            translate('check_latency')
          )}
        </Button>
      </form>
      
      {(isLoading || results) && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>{translate('result')}</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Checking latency from multiple regions...</span>
              </div>
            ) : (
               results && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Region</TableHead>
                      <TableHead className="text-right">Latency</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.map((result) => (
                      <TableRow key={result.region}>
                        <TableCell className="font-medium">{result.region}</TableCell>
                        <TableCell className="text-right">
                          {typeof result.latency === 'number' ? `${result.latency} ms` : result.latency}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
               )
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
