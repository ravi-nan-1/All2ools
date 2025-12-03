
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { LanguageProvider } from '@/context/language-context';
import { ClientOnly } from '@/components/shared/client-only';
import { DeferredAdBanner } from '@/components/shared/deferred-ad-banner';
import { Suspense } from 'react';
import { MainLayout } from '@/components/shared/main-layout';


export const metadata: Metadata = {
  title: 'All2ools | Free AI-Powered Tools for Finance, SEO, & Business',
  description: 'The ultimate suite of 30+ free online tools powered by AI. Explore tools for finance, SEO, image editing, business management, developers, and more. Boost your productivity today.',
  keywords: 'ai humanizer, text humanizer, humanize ai text, convert ai text to human, pdf to word, word to pdf, pdf editor, pdf converter, file converter, universal file converter, plagiarism checker, detect plagiarism online, excel tools, excel automation, url shortener, shorten link, image converter, jpg to png, rent map, apartment finder, compress image, reduce image size, pdf summarizer, ai summary tool, online tools, free web tools, pdf tools, image tools, writing tools, seo tools, ai tools, productivity tools, all-in-one online tools, convert files online, qr code generator, free qr creator, ai tutor, study assistant ai, image crop, image resize',
  icons: {
    icon: '/favicon.ico',
  },
  other: {
    'google-adsense-account': 'ca-pub-3080938150148610',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="preload"
          as="style"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Source+Code+Pro&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Source+Code+Pro&display=swap"
        />
      </head>
      <body className="font-body antialiased">
        <LanguageProvider>
          <Suspense fallback={<div>Loading...</div>}>
            <MainLayout>{children}</MainLayout>
          </Suspense>
          <Toaster />
          <ClientOnly>
            <DeferredAdBanner
              adSlot="YOUR_STICKY_AD_SLOT_ID"
              adFormat="auto"
              dataFullWidthResponsive={true}
              className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-center border-t bg-background"
              style={{ minHeight: '50px' }}
            />
          </ClientOnly>
        </LanguageProvider>
      </body>
    </html>
  );
}
