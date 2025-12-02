
"use client";

export function AiTutor() {
  const toolUrl = 'https://AItutor.all2ools.com';

  return (
    <iframe
      src={toolUrl}
      className="w-full h-full border-0"
      style={{ height: '100vh' }}
      title="AI Tutor"
      allow="fullscreen"
    />
  );
}
