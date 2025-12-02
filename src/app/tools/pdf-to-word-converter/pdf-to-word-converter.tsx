
"use client";

export function PdfToWordConverter() {
  const toolUrl = 'https://pdf2word.all2ools.com';

  return (
    <iframe
      src={toolUrl}
      className="w-full h-full border-0"
      style={{ height: '100vh' }}
      title="PDF to Word Converter"
      allow="fullscreen"
    />
  );
}
