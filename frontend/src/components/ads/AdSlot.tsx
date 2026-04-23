"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface AdSlotProps {
  slot: string;
  format?: "auto" | "fluid" | "rectangle" | "horizontal";
  layoutKey?: string;
  className?: string;
  /** Minimum height to reserve while ad loads, preventing CLS. */
  minHeight?: number;
}

export function AdSlot({
  slot,
  format = "auto",
  layoutKey,
  className,
  minHeight = 90,
}: AdSlotProps) {
  const ref = useRef<HTMLModElement>(null);
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  useEffect(() => {
    if (!client) return;
    try {
      // @ts-expect-error - adsbygoogle is injected by the AdSense script
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      /* ad init failures are non-fatal */
    }
  }, [client]);

  if (!client) {
    // AdSense not configured — render nothing. Set NEXT_PUBLIC_ADSENSE_CLIENT
    // to re-enable ads everywhere without a code change.
    return null;
  }

  return (
    <ins
      ref={ref}
      className={cn("adsbygoogle block", className)}
      style={{ display: "block", minHeight }}
      data-ad-client={client}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive="true"
      {...(layoutKey ? { "data-ad-layout-key": layoutKey } : {})}
    />
  );
}
