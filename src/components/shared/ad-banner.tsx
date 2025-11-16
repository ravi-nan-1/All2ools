"use client";

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';

declare global {
  interface Window {
    adsbygoogle: any;
  }
}

interface AdBannerProps extends React.HTMLAttributes<HTMLDivElement> {
    adSlot: string;
    adFormat?: string;
    dataFullWidthResponsive?: boolean;
}

export function AdBanner({ adSlot, adFormat = "auto", dataFullWidthResponsive = false, ...props }: AdBannerProps) {
  const pathname = usePathname();

  useEffect(() => {
    try {
      if (window.adsbygoogle) {
        console.log('Pushing ad for slot:', adSlot);
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (err) {
      console.error(`AdSense error for slot ${adSlot}:`, err);
    }
  }, []);

  return (
    <div {...props} key={`${pathname}-${adSlot}`}>
        <ins className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client="ca-pub-3080938150148610"
            data-ad-slot={adSlot}
            data-ad-format={adFormat}
            data-full-width-responsive={dataFullWidthResponsive.toString()}
            >
        </ins>
    </div>
  );
}
