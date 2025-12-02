"use client";

export function AiProductBackgroundRemover() {
  const toolUrl = 'https://image.all2ools.com';

  return (
    <iframe
      src={toolUrl}
      className="w-full h-full border-0"
      title="AI Product Background Remover"
      allow="fullscreen"
    />
  );
}
