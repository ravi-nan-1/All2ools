"use client";

export function PlagiarismChecker() {
  const toolUrl = 'https://plagiarism.all2ools.com/';

  return (
    <iframe
      src={toolUrl}
      className="w-full h-full border-0"
      style={{ height: '100vh' }}
      title="Plagiarism Checker"
      allow="fullscreen"
    />
  );
}
