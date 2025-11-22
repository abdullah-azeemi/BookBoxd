'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  fallbackSrc?: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
}

export default function ImageWithFallback({
  src,
  alt,
  fallbackSrc = '/placeholder.svg',
  width,
  height,
  className,
  priority,
}: ImageWithFallbackProps) {
  const [resolvedSrc, setResolvedSrc] = useState<string>(src);

  useEffect(() => {
    let cancelled = false;
    const tester = new window.Image();
    tester.src = src;
    tester.onload = () => {
      if (!cancelled) setResolvedSrc(src);
    };
    tester.onerror = () => {
      if (!cancelled) setResolvedSrc(fallbackSrc);
    };
    return () => {
      cancelled = true;
    };
  }, [src, fallbackSrc]);

  return (
    <Image
      src={resolvedSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      unoptimized
    />
  );
}