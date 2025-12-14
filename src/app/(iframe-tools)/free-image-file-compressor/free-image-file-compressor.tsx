
"use client";

export function FreeImageFileCompressor() {
  const toolUrl = 'https://imagecompressor.all2ools.com/';

  return (
    <iframe
      src={toolUrl}
      className="w-full h-screen border-0"
      title="Free Image/File Compressor"
      allow="fullscreen"
    />
  );
}
