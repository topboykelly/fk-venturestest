"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";

/** Product photo with a soft accent backdrop if the image is missing. */
export function ProductImage({
  src,
  alt,
  sizes,
  preload = false,
  className,
  imageClassName,
  fit = "contain",
}: {
  src: string;
  alt: string;
  sizes: string;
  preload?: boolean;
  className?: string;
  imageClassName?: string;
  fit?: "cover" | "contain";
}) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const failed = !src || failedSrc === src;

  const checkLoaded = useCallback(
    (img: HTMLImageElement | null) => {
      if (img?.complete && img.naturalWidth === 0) setFailedSrc(src);
    },
    [src],
  );

  return (
    <div className={cn("relative overflow-hidden bg-accent-soft", className)}>
      {!failed ? (
        <Image
          key={src}
          ref={checkLoaded}
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          preload={preload}
          loading={preload ? "eager" : undefined}
          onError={() => setFailedSrc(src)}
          style={{ objectFit: fit, objectPosition: "center" }}
          className={cn("text-transparent p-4", imageClassName)}
        />
      ) : (
        <div className="absolute inset-0 grid place-items-center text-accent/40">
          <span className="text-sm font-medium">No photo</span>
        </div>
      )}
    </div>
  );
}
