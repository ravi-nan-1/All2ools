
"use client";

export function FreeCheatSheetGenerator() {
  const toolUrl = 'https://summary.all2ools.com/';

  return (
    <iframe
      src={toolUrl}
      className="w-full h-screen border-0"
      title="Free Cheat Sheet Generator"
      allow="fullscreen"
    />
  );
}
