"use client";

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

declare global {
  interface Window {
    adsbygoogle: any;
  }
}

interface AdBannerProps extends React.HTMLAttributes<HTMLElement> {
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

  // Using a key that changes with the pathname forces React to re-mount the component on route changes,
  // which is a reliable way to get AdSense to re-render the ad.
  return (
    <div key={pathname} className={cn("adsbygoogle-container", className)} {...props}>
    </div>
  );
}
