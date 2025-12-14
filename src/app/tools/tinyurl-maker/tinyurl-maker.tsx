
"use client";

export function TinyUrlMaker() {
  const toolUrl = 'https://tinyurl.all2ools.com/';

  return (
    <iframe
      src={toolUrl}
      className="w-full h-screen border-0"
      title="TinyURL Maker"
      allow="fullscreen"
    />
  );
}
