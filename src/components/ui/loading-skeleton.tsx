import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div className={`bg-secondary animate-pulse rounded-lg ${className}`} />
  );
};

export const DramaCardSkeleton: React.FC = () => {
  return (
    <div className="w-40 md:w-48 flex-shrink-0">
      <Skeleton className="aspect-[2/3] rounded-xl mb-3" />
      <Skeleton className="h-4 w-3/4 mb-2" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  );
};

export const HeroBannerSkeleton: React.FC = () => {
  return (
    <div className="relative h-[60vh] md:h-[70vh] overflow-hidden rounded-2xl mb-8">
      <Skeleton className="absolute inset-0" />
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
        <Skeleton className="h-6 w-24 rounded-full mb-4" />
        <Skeleton className="h-12 w-2/3 mb-4" />
        <Skeleton className="h-4 w-1/3 mb-4" />
        <Skeleton className="h-4 w-1/2 mb-6" />
        <div className="flex gap-3">
          <Skeleton className="h-12 w-36 rounded-xl" />
          <Skeleton className="h-12 w-28 rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export const CarouselSkeleton: React.FC = () => {
  return (
    <section className="mb-8">
      <Skeleton className="h-8 w-48 mb-4" />
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <DramaCardSkeleton key={i} />
        ))}
      </div>
    </section>
  );
};
