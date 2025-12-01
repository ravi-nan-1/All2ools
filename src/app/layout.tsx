import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/shared/header';
import { Footer } from '@/components/shared/footer';
import { LanguageProvider } from '@/context/language-context';
import { AdBanner } from '@/components/shared/ad-banner';

export const metadata: Metadata = {
  title: 'All2ools | Free AI-Powered Tools for Finance, SEO, & Business',
  description: 'The ultimate suite of 30+ free online tools powered by AI. Explore tools for finance, SEO, image editing, business management, developers, and more. Boost your productivity today.',
  keywords: 'online tools, free web tools, pdf tools, image tools, writing tools, seo tools, ai tools, productivity tools, all-in-one online tools, convert files online',
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
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3080938150148610"
          crossOrigin="anonymous"
        ></script>
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
