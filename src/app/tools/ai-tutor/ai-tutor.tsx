
"use client";

export function AiTutor() {
  const toolUrl = 'https://AItutor.all2ools.com';

  return (
    <iframe
      src={toolUrl}
      className="w-full h-screen border-0"
      title="AI Tutor"
      allow="fullscreen"
    />
  );
}
