"use client";

export function PlagiarismChecker() {
  const toolUrl = 'https://plagiarism.all2ools.com/';

  return (
    <iframe
      src={toolUrl}
      className="w-full h-screen border-0"
      title="Plagiarism Checker"
      allow="fullscreen"
    />
  );
}
