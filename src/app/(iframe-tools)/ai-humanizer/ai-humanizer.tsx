"use client";

export function AiHumanizer() {
  const toolUrl = 'https://humanizer.all2ools.com/';

  return (
    <iframe
      src={toolUrl}
      className="w-full h-screen border-0"
      title="AI Humanizer Tool"
      allow="fullscreen"
    />
  );
}
