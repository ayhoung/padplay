"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  images: string[];
  alt: string;
}

export function ScreenshotGallery({ images, alt }: Props) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const close = useCallback(() => setOpenIdx(null), []);
  const next = useCallback(() => {
    setOpenIdx((i) => (i === null ? null : (i + 1) % images.length));
  }, [images.length]);
  const prev = useCallback(() => {
    setOpenIdx((i) => (i === null ? null : (i - 1 + images.length) % images.length));
  }, [images.length]);

  useEffect(() => {
    if (openIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    // Lock body scroll while modal is open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = originalOverflow;
    };
  }, [openIdx, close, next, prev]);

  if (!images.length) return null;

  return (
    <>
      <ul
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
        aria-label="Screenshots"
      >
        {images.map((src, idx) => (
          <li key={src + idx}>
            <button
              type="button"
              onClick={() => setOpenIdx(idx)}
              className="block w-full rounded-lg overflow-hidden bg-slate-100 hover:ring-2 hover:ring-brand-400 focus-visible:ring-2 focus-visible:ring-brand-500 focus:outline-none transition-shadow"
              aria-label={`Open screenshot ${idx + 1}`}
            >
              <Image
                src={src}
                alt={`${alt} screenshot ${idx + 1}`}
                width={400}
                height={300}
                className="w-full h-auto object-cover aspect-[4/3]"
                unoptimized
              />
            </button>
          </li>
        ))}
      </ul>

      {openIdx !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${alt} screenshot ${openIdx + 1} of ${images.length}`}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <X className="h-6 w-6" aria-hidden />
          </button>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                aria-label="Previous"
                className="absolute left-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <ChevronLeft className="h-7 w-7" aria-hidden />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                aria-label="Next"
                className="absolute right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <ChevronRight className="h-7 w-7" aria-hidden />
              </button>
            </>
          )}

          <div
            className="max-w-[92vw] max-h-[92vh] flex items-center justify-center px-4 py-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[openIdx]}
              alt={`${alt} screenshot ${openIdx + 1} of ${images.length}`}
              width={1600}
              height={1200}
              className={cn(
                "max-h-[88vh] w-auto h-auto object-contain rounded-lg shadow-2xl",
              )}
              unoptimized
              priority
            />
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80 text-sm font-medium bg-black/40 px-3 py-1 rounded-full">
            {openIdx + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
