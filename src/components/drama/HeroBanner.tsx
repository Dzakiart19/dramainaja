import React from 'react';
import { Play, Info, Star } from 'lucide-react';
import { Drama } from '@/core/types';
import { usePlatform } from '@/core/context/PlatformContext';
import { Link } from 'react-router-dom';

interface HeroBannerProps {
  drama: Drama;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ drama }) => {
  const { currentPlatform } = usePlatform();

  return (
    <div className="relative h-[60vh] md:h-[70vh] overflow-hidden rounded-2xl mb-8">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={drama.cover}
          alt={drama.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />
      </div>

      {/* Glow Effect */}
      <div 
        className="absolute bottom-0 left-0 w-1/2 h-1/2 opacity-30 blur-3xl"
        style={{ background: `radial-gradient(circle, ${currentPlatform.color}, transparent)` }}
      />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
        <div className="max-w-2xl">
          {/* Platform Badge */}
          <div 
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4"
            style={{ backgroundColor: currentPlatform.color }}
          >
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            {currentPlatform.name}
          </div>

          {/* Title */}
          <h1 className="font-display text-3xl md:text-5xl font-bold mb-4 leading-tight">
            {drama.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
            {drama.rating && drama.rating > 0 && (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="font-medium text-foreground">{drama.rating.toFixed(1)}</span>
              </div>
            )}
            {drama.year && <span>{drama.year}</span>}
            {drama.episodes && drama.episodes > 0 && <span>{drama.episodes} Episodes</span>}
            {drama.genre && drama.genre.length > 0 && (
              <span>{Array.isArray(drama.genre) ? drama.genre.slice(0, 2).join(' • ') : drama.genre}</span>
            )}
          </div>

          {/* Description */}
          {drama.description && (
            <p className="text-muted-foreground line-clamp-2 mb-6 max-w-xl">
              {drama.description}
            </p>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <Link
              to={`/watch/${drama.id}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105"
              style={{ backgroundColor: currentPlatform.color }}
            >
              <Play className="w-5 h-5 fill-current" />
              Watch Now
            </Link>
            <Link
              to={`/drama/${drama.id}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold glass hover:bg-white/20 transition-all"
            >
              <Info className="w-5 h-5" />
              Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
