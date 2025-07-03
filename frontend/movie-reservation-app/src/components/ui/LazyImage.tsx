import React, { useState, useRef, useEffect } from 'react';
import { useIntersectionObserver } from '../../hooks/useVirtualization';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  fallback?: string;
  placeholder?: React.ReactNode;
  onLoad?: () => void;
  onError?: () => void;
}

export function LazyImage({
  src,
  alt,
  className = '',
  fallback = '/placeholder-movie.svg',
  placeholder,
  onLoad,
  onError,
}: LazyImageProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);
  const { hasIntersected } = useIntersectionObserver(imgRef);

  useEffect(() => {
    if (!hasIntersected || !src) return;

    const img = new Image();
    
    img.onload = () => {
      setImageSrc(src);
      setIsLoading(false);
      setHasError(false);
      onLoad?.();
    };

    img.onerror = () => {
      setImageSrc(fallback);
      setIsLoading(false);
      setHasError(true);
      onError?.();
    };

    img.src = src;
  }, [hasIntersected, src, fallback, onLoad, onError]);

  const defaultPlaceholder = (
    <div className="flex items-center justify-center bg-gray-200 animate-pulse">
      <div className="text-gray-400 text-sm">Cargando...</div>
    </div>
  );

  return (
    <div ref={imgRef} className={className}>
      {!hasIntersected || isLoading ? (
        placeholder || defaultPlaceholder
      ) : (
        <img
          src={imageSrc || fallback}
          alt={alt}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      )}
    </div>
  );
} 