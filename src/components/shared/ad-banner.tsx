"use client";

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

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

export function AdBanner({ 
  adSlot, 
  adFormat = "auto", 
  dataFullWidthResponsive = false, 
  className, 
  ...props 
}: AdBannerProps) {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  useEffect(() => {
    if (isMounted) {
      try {
        if (window.adsbygoogle) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
      } catch (err) {
        console.error(`AdSense error for slot ${adSlot}:`, err);
      }
    }
  }, [pathname, isMounted, adSlot]);

  if (!isMounted) {
    return null;
  }

  return (
    <div key={pathname} className={cn(className)} {...props}>
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-3080938150148610"
          data-ad-slot={adSlot}
          data-ad-format={adFormat}
          data-full-width-responsive={dataFullWidthResponsive.toString()}
        ></ins>
    </div>
  );
}
