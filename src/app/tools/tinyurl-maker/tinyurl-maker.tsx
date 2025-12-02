
"use client";

export function TinyUrlMaker() {
  const toolUrl = 'https://tinyurl.all2ools.com/';

  return (
    <iframe
      src={toolUrl}
      className="w-full h-full border-0"
      style={{ height: '100vh' }}
      title="TinyURL Maker"
      allow="fullscreen"
    />
  );
}
