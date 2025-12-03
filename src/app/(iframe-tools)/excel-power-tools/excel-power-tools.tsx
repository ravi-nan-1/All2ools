"use client";

export function ExcelPowerTools() {
  const toolUrl = 'https://iloveexcel.all2ools.com';

  return (
    <iframe
      src={toolUrl}
      className="w-full h-full border-0"
      style={{ height: '100vh' }}
      title="Excel Power Tools"
      allow="fullscreen"
    />
  );
}
