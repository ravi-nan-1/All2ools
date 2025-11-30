"use client";

import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, XCircle, Shield, Info } from 'lucide-react';
import { jwtVerify, decodeJwt } from 'jose';

// Helper to format JSON with indentation
const formatJson = (obj: any) => JSON.stringify(obj, null, 2);

export function JwtDecoderValidator() {
  const [encodedToken, setEncodedToken] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [header, setHeader] = useState<object | null>(null);
  const [payload, setPayload] = useState<object | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'valid' | 'invalid' | 'error'>();
  const [verificationError, setVerificationError] = useState<string | null>(null);

  // Function to decode header/payload without validation
  const decodeToken = (token: string) => {
    try {
      setError(null);
      const decodedHeader = decodeJwt(token);
      
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid JWT structure. The token must have three parts separated by dots.');
      }
      const decodedPayload = JSON.parse(new TextDecoder().decode(Buffer.from(parts[1], 'base64')));

      setHeader(decodedHeader);
      setPayload(decodedPayload);
    } catch (e: any) {
      setHeader(null);
      setPayload(null);
      if (e.message.includes('Invalid Compact JWS')) {
         setError('Invalid JWT structure. The token must have three parts separated by dots.');
      } else if (e.message.includes('base64')) {
        setError('Invalid JWT: Header or Payload is not correctly Base64Url encoded.');
      } else {
        setError('Failed to decode JWT. Please ensure it is a valid token.');
      }
    }
  }

  useEffect(() => {
    if (!encodedToken.trim()) {
      setHeader(null);
      setPayload(null);
      setError(null);
      setVerificationStatus('idle');
      setVerificationError(null);
      return;
    }
    
    decodeToken(encodedToken);
    
    // Asynchronously verify the token when token or key changes
    const verify = async () => {
      if (!secretKey.trim()) {
        setVerificationStatus('idle');
        return;
      }

      try {
        setVerificationError(null);
        const alg = (decodeJwt(encodedToken) as any).alg as string;

        let key: CryptoKey | Uint8Array;
        if (alg.startsWith('HS')) { // Symmetric HMAC algorithms
          key = new TextEncoder().encode(secretKey);
        } else { // Asymmetric algorithms (RS, ES, PS)
            const pemHeader = "-----BEGIN PUBLIC KEY-----";
            const pemFooter = "-----END PUBLIC KEY-----";
            let pemContents = secretKey.substring(pemHeader.length, secretKey.length - pemFooter.length -1).replace(/\s/g, '');
            let binaryDer = new Uint8Array(atob(pemContents).split('').map(c => c.charCodeAt(0)));
            key = await crypto.subtle.importKey(
                'spki',
                binaryDer,
                {
                    name: alg.startsWith('RS') ? 'RSASSA-PKCS1-v1_5' : 'ECDSA',
                    hash: `SHA-${alg.substring(2)}`
                },
                true,
                ['verify']
            );
        }
        
        await jwtVerify(encodedToken, key);
        setVerificationStatus('valid');
      } catch (e: any) {
        setVerificationStatus('invalid');
        if (e.code === 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED') {
            setVerificationError('Signature verification failed.');
        } else if (e.code === 'ERR_JWT_EXPIRED') {
            setVerificationError(`Token expired at ${new Date(payload?.exp * 1000).toLocaleString()}`);
        } else if (e.code === 'ERR_JWT_CLAIM_VALIDATION_FAILED' && e.claim === 'nbf') {
            setVerificationError(`Token is not yet active (nbf: ${new Date(payload?.nbf * 1000).toLocaleString()}).`);
        } else {
            setVerificationError(`Verification Error: ${e.message}. Ensure your key matches the token's algorithm.`);
        }
      }
    };
    
    verify();
    
  }, [encodedToken, secretKey]);


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
                <AlertTitle>Decoding Error</AlertTitle>
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
      
       <div className="space-y-2 pt-4 border-t">
          <h3 className="text-lg font-semibold flex items-center gap-2"><Shield className="text-primary"/>Verify Signature</h3>
            <Textarea
              id="secret-key"
              placeholder="Paste your HMAC secret or PEM-formatted public key here"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              className="min-h-[100px] font-mono text-sm"
              aria-label="Secret or Public Key"
              disabled={!encodedToken}
            />
       </div>

      {verificationStatus === 'valid' && (
        <Alert className="border-green-500/50 text-green-700 dark:text-green-400">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <AlertTitle>Signature Verified</AlertTitle>
            <AlertDescription>The token's signature is valid.</AlertDescription>
        </Alert>
      )}
      {verificationStatus === 'invalid' && (
         <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Invalid Signature</AlertTitle>
            <AlertDescription>{verificationError || 'The token\'s signature is not valid.'}</AlertDescription>
        </Alert>
      )}
       {verificationStatus === 'idle' && encodedToken && (
         <Alert variant="default">
            <Info className="h-4 w-4" />
            <AlertTitle>Verify Signature</AlertTitle>
            <AlertDescription>Paste your secret or public key above to verify the token's signature.</AlertDescription>
        </Alert>
      )}

       <p className="text-xs text-muted-foreground text-center pt-4">
        All processing is done securely on your local machine. Your token is never sent to our servers.
      </p>
    </div>
  );
}
