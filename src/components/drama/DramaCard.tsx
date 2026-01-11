import React from 'react';
import { Play, Star } from 'lucide-react';
import { Drama } from '@/core/types';
import { Link } from 'react-router-dom';

interface DramaCardProps {
  drama: Drama;
  size?: 'small' | 'medium' | 'large';
}

export const DramaCard: React.FC<DramaCardProps> = ({ drama, size = 'medium' }) => {
  const sizeClasses = {
    small: 'w-32',
    medium: 'w-40 md:w-48',
    large: 'w-48 md:w-56',
  };

  return (
    <Link to={`/drama/${drama.id}`} className={`group relative overflow-hidden rounded-xl bg-card border border-white/5 transition-all duration-300 hover:scale-[1.02] hover:border-white/20 flex-shrink-0 ${sizeClasses[size]}`}>
      <div className="relative overflow-hidden">
        <img
          src={drama.cover}
          alt={drama.title}
          className="w-full aspect-[2/3] object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop';
          }}
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
          <div className="flex items-center justify-center mb-2">
            <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center pulse-glow">
              <Play className="w-6 h-6 text-primary-foreground fill-primary-foreground ml-1" />
            </div>
          </div>
        </div>

        {/* Badge */}
        {drama.rating && drama.rating > 0 && (
          <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-full bg-black/70 backdrop-blur-sm text-xs font-medium">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span>{drama.rating.toFixed(1)}</span>
          </div>
        )}

        {/* Episodes Badge */}
        {drama.episodes && drama.episodes > 0 && (
          <div className="absolute top-2 left-2 px-2 py-1 rounded-full bg-primary/90 text-xs font-medium text-primary-foreground">
            {drama.episodes} Eps
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="font-semibold text-sm line-clamp-2 leading-tight mb-1">
          {drama.title}
        </h3>
        {drama.genre && drama.genre.length > 0 && (
          <p className="text-xs text-muted-foreground line-clamp-1">
            {Array.isArray(drama.genre) ? drama.genre.slice(0, 2).join(' • ') : drama.genre}
          </p>
        )}
      </div>
    </Link>
  );
};
