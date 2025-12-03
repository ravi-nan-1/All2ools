
"use client";

export function FreeQrCodeGenerator() {
  const toolUrl = 'https://qr.all2ools.com/';

  return (
    <iframe
      src={toolUrl}
      className="w-full h-full border-0"
      style={{ height: '100vh' }}
      title="Free QR Code Generator"
      allow="fullscreen"
    />
  );
}
