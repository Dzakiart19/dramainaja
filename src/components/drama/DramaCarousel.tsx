import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Drama } from '@/core/types';
import { DramaCard } from './DramaCard';

interface DramaCarouselProps {
  dramas: Drama[];
  title: string;
  showAll?: boolean;
}

export const DramaCarousel: React.FC<DramaCarouselProps> = ({ dramas, title, showAll = true }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="mb-8 relative group">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl md:text-2xl font-bold">{title}</h2>
        {showAll && (
          <button className="text-sm text-primary hover:underline">
            View All →
          </button>
        )}
      </div>

      {/* Scroll Buttons */}
      <button
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full glass flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 hover:bg-white/20"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full glass flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 hover:bg-white/20"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Carousel */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {dramas.map((drama) => (
          <DramaCard key={drama.id} drama={drama} size="medium" />
        ))}
      </div>
    </section>
  );
};
