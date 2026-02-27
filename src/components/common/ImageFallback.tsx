// components/common/ImageFallback.tsx
import React, { useState } from 'react';

interface ImageFallbackProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
}

const ImageFallback: React.FC<ImageFallbackProps> = ({
  src,
  alt,
  className = '',
  fallbackSrc = 'https://images.unsplash.com/photo-1534367507877-0edd93bd013b?w=400&h=300&fit=crop'
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-800 animate-pulse rounded-lg" />
      )}
      
      <img
        src={hasError ? fallbackSrc : src}
        alt={alt}
        className={`w-full h-full object-cover rounded-lg transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onError={handleError}
        onLoad={handleLoad}
        loading="lazy"
      />
      
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 rounded-lg">
          <div className="text-center p-4">
            <i className="fas fa-dumbbell text-2xl text-gray-400 mb-2"></i>
            <p className="text-sm text-gray-300">Imagem não disponível</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageFallback;