"use client";

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

declare global {
  interface Window {
    adsbygoogle: any;
  }
}

interface AdBannerProps extends React.HTMLAttributes<HTMLModElement> {
    adSlot: string;
    adFormat?: string;
    dataFullWidthResponsive?: boolean;
}

export function AdBanner({ adSlot, adFormat = "auto", dataFullWidthResponsive = false, className, ...props }: AdBannerProps) {
  const pathname = usePathname();

  useEffect(() => {
    try {
      if (window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (err) {
      console.error(`AdSense error for slot ${adSlot}:`, err);
    }
  }, [pathname, adSlot]);

  return (
      <ins
        className={cn('adsbygoogle', className)}
        style={{ display: 'block' }}
        data-ad-client="ca-pub-3080938150148610"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={dataFullWidthResponsive.toString()}
        {...props}
      ></ins>
  );
}
