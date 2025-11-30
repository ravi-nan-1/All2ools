"use client";

import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';
import { decodeJwt } from 'jose';

// Helper to format JSON with indentation
const formatJson = (obj: any) => JSON.stringify(obj, null, 2);

// Decode Base64URL string
function base64UrlDecode(str: string) {
  // Add padding if missing
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) {
    str += '=';
  }
  try {
    return atob(str);
  } catch (e) {
    console.error('Base64 decoding failed:', e);
    return '';
  }
}

export function JwtDecoderValidator() {
  const [encodedToken, setEncodedToken] = useState('');
  const [header, setHeader] = useState<object | null>(null);
  const [payload, setPayload] = useState<object | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isExpired, setIsExpired] = useState<boolean | null>(null);

  useEffect(() => {
    if (!encodedToken.trim()) {
      setHeader(null);
      setPayload(null);
      setError(null);
      setIsExpired(null);
      return;
    }

    try {
      setError(null);
      const parts = encodedToken.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid JWT structure. The token must have three parts separated by dots.');
      }

      const decodedHeader = JSON.parse(base64UrlDecode(parts[0]));
      const decodedPayload = JSON.parse(base64UrlDecode(parts[1]));
      
      setHeader(decodedHeader);
      setPayload(decodedPayload);

      // Check expiration
      if (decodedPayload.exp) {
        const expirationDate = new Date(decodedPayload.exp * 1000);
        setIsExpired(expirationDate < new Date());
      } else {
        setIsExpired(null); // No expiration claim
      }

    } catch (e: any) {
      setHeader(null);
      setPayload(null);
      setIsExpired(null);
      if (e.message.includes('JSON.parse')) {
        setError('Invalid JWT: Header or Payload is not valid JSON.');
      } else if (e.message.includes('URI malformed') || e.message.includes('base64')) {
        setError('Invalid JWT: Header or Payload is not correctly Base64Url encoded.');
      } else {
        setError(e.message);
      }
    }
  }, [encodedToken]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="encoded-token" className="text-lg font-semibold">Encoded Token</Label>
        <Textarea
          id="encoded-token"
          placeholder="Paste your JWT here..."
          value={encodedToken}
          onChange={(e) => setEncodedToken(e.target.value)}
          className="min-h-[120px] font-mono text-sm"
          aria-label="Encoded JWT"
        />
        {error && (
            <Alert variant="destructive" className="mt-2">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-primary">Header</h3>
          <pre className="p-4 bg-muted rounded-md text-sm overflow-x-auto font-mono whitespace-pre-wrap">
            {header ? formatJson(header) : '...'}
          </pre>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-primary">Payload</h3>
          <pre className="p-4 bg-muted rounded-md text-sm overflow-x-auto font-mono whitespace-pre-wrap">
            {payload ? formatJson(payload) : '...'}
          </pre>
        </div>
      </div>
      
      {isExpired !== null && (
        <div>
          {isExpired ? (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Token Expired</AlertTitle>
              <AlertDescription>
                This token's expiration date has passed.
              </AlertDescription>
            </Alert>
          ) : (
             <Alert className="border-green-500/50 text-green-700 dark:text-green-400">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <AlertTitle>Token is Active</AlertTitle>
              <AlertDescription>
                This token has not expired.
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}

      <div className="space-y-2 pt-4 border-t">
          <h3 className="text-lg font-semibold">Verify Signature</h3>
          <p className="text-sm text-muted-foreground">
            Signature verification is not yet implemented in this tool. All decoding happens securely in your browser.
          </p>
          <Alert>
            <Clock className="h-4 w-4" />
            <AlertTitle>Coming Soon</AlertTitle>
            <AlertDescription>
              We are working on adding signature verification for HS256, RS256, and other common algorithms.
            </AlertDescription>
          </Alert>
      </div>

       <p className="text-xs text-muted-foreground text-center pt-4">
        All processing is done securely on your local machine. Your token is never sent to our servers.
      </p>
    </div>
  );
}
