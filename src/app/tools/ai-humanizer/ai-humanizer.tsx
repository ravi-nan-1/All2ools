
"use client";

export function AiHumanizer() {
  const toolUrl = 'https://humanizer.all2ools.com/';

  return (
    <div className="w-full h-[80vh] min-h-[600px] flex flex-col">
      <iframe
        src={toolUrl}
        className="w-full h-full border-0"
        title="AI Humanizer Tool"
        allow="fullscreen"
      />
    </div>
  );
}
