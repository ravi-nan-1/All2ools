
'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/shared/header';
import { Footer } from '@/components/shared/footer';
import { ClientOnly } from '@/components/shared/client-only';
import { DeferredAdBanner } from '@/components/shared/deferred-ad-banner';

const iframeTools = [
  'ai-humanizer',
  'free-qr-code-generator',
  'free-cheat-sheet-generator',
  'free-image-file-compressor',
  'tinyurl-maker',
  'ai-product-background-remover',
  'pdf-to-word-converter',
  'ai-tutor',
  'excel-power-tools',
  'plagiarism-checker',
];

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const slug = pathname.split('/')[2];
  const isIframePage = iframeTools.includes(slug);

  if (isIframePage) {
    return <div className="w-full h-screen overflow-hidden">{children}</div>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <ClientOnly>
        <DeferredAdBanner
          adSlot="YOUR_BOTTOM_BANNER_AD_SLOT_ID"
          className="w-full min-h-[100px] flex items-center justify-center bg-muted my-4"
        />
      </ClientOnly>
      <Footer />
    </div>
  );
}
