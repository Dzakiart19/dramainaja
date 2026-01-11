import React from 'react';
import { Drama } from '@/core/types';
import { DramaCard } from './DramaCard';

interface DramaGridProps {
  dramas: Drama[];
  title?: string;
  showAll?: boolean;
}

export const DramaGrid: React.FC<DramaGridProps> = ({ dramas, title, showAll = false }) => {
  return (
    <section className="mb-8">
      {title && (
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl md:text-2xl font-bold">{title}</h2>
          {showAll && (
            <button className="text-sm text-primary hover:underline">
              View All →
            </button>
          )}
        </div>
      )}
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {dramas.map((drama) => (
          <DramaCard key={drama.id} drama={drama} />
        ))}
      </div>
    </section>
  );
};
