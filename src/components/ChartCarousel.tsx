// components/ChartCarousel.tsx
import React, { useState, useEffect, useRef } from 'react';

interface ChartCarouselProps {
  children: React.ReactNode[];
}

const ChartCarousel: React.FC<ChartCarouselProps> = ({ children }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
  const minSwipeDistance = 50;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % children.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + children.length) % children.length);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrev();
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    
    if (isMobile && children.length > 1) {
      interval = setInterval(() => {
        goToNext();
      }, 8000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isMobile, children.length, currentIndex]);

  if (!isMobile) {
    return <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">{children}</div>;
  }

  return (
    <div className="relative mb-8">
      <div
        className="overflow-hidden touch-pan-y"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
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