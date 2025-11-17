import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/shared/header';
import { Footer } from '@/components/shared/footer';
import { LanguageProvider } from '@/context/language-context';
import { AdBanner } from '@/components/shared/ad-banner';

export const metadata: Metadata = {
  title: 'All2ools | The Ultimate Suite of Free AI-Powered Online Tools',
  description: 'Finance, SEO, images, business, developer tools & more.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3080938150148610"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Source+Code+Pro&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <LanguageProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <AdBanner
              adSlot="YOUR_BOTTOM_BANNER_AD_SLOT_ID"
              className="w-full min-h-[100px] flex items-center justify-center bg-muted my-4"
            />
            <Footer />
          </div>
          <Toaster />
          <AdBanner
            adSlot="YOUR_STICKY_AD_SLOT_ID"
            adFormat="auto"
            dataFullWidthResponsive={true}
            className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-center border-t bg-background"
            style={{ minHeight: '50px' }}
          />
        </LanguageProvider>
      </body>
    </html>
  );
}
