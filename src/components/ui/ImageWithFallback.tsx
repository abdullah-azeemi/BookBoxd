'use client';

import React, { ImgHTMLAttributes } from 'react';

// Define props by extending standard HTML <img> attributes
interface ImageWithFallbackProps extends ImgHTMLAttributes<HTMLImageElement> {
    fallbackSrc?: string;
    alt: string; 
}

/**
 * ImageWithFallback is a Client Component that allows an onError event handler.
 * It attempts to load the primary image source, and if it fails, it falls back
 * to a specified placeholder image.
 */
export default function ImageWithFallback({ 
    src, 
    fallbackSrc = '/placeholder.svg', // Default fallback image path
    alt, 
    ...props 
}: ImageWithFallbackProps) {
  
  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    // If the image fails to load, set the source to the fallback image.
    // Setting onError to null prevents an infinite loop if the fallback also fails.
    e.currentTarget.onerror = null; 
    e.currentTarget.src = fallbackSrc;
  };

  return (
    <img
      src={src}
      alt={alt}
      // Pass the event handler here, which is allowed because this is a client component
      onError={handleError}
      // Spread any other props (className, width, height, etc.)
      {...props}
    />
  );
}