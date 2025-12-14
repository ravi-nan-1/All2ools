"use client";

export function PdfToWordConverter() {
  const toolUrl = 'https://pdf2word.all2ools.com';

  return (
    <iframe
      src={toolUrl}
      className="w-full h-screen border-0"
      title="PDF to Word Converter"
      allow="fullscreen"
    />
  );
}
