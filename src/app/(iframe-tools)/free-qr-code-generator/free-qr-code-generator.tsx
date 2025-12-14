
"use client";

export function FreeQrCodeGenerator() {
  const toolUrl = 'https://qr.all2ools.com/';

  return (
    <iframe
      src={toolUrl}
      className="w-full h-screen border-0"
      title="Free QR Code Generator"
      allow="fullscreen"
    />
  );
}
