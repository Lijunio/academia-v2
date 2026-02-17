// src/components/ChartCarousel.tsx
import React, { useState, useEffect, useRef } from 'react';

interface ChartCarouselProps {
  children: React.ReactNode[];
}

const ChartCarousel: React.FC<ChartCarouselProps> = ({ children }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-play apenas em mobile
  useEffect(() => {
    if (isMobile && children.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % children.length);
      }, 10000); // 10 segundos
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isMobile, children.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      // Deslizou para esquerda - próximo
      setCurrentIndex((prev) => (prev + 1) % children.length);
    } else if (touchEndX.current - touchStartX.current > 50) {
      // Deslizou para direita - anterior
      setCurrentIndex((prev) => (prev - 1 + children.length) % children.length);
    }
  };

  if (!isMobile) {
    // Em desktop, mostra todos os filhos em grid
    return <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">{children}</div>;
  }

  // Em mobile, mostra carrossel (apenas swipe, sem botões)
  return (
    <div className="relative mb-8">
      <div
        className="overflow-hidden touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {children.map((child, index) => (
            <div key={index} className="w-full flex-shrink-0 px-1">
              {child}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChartCarousel;