import React, { useEffect, useState } from 'react';
import { Trophy, Medal, Award } from 'lucide-react';
import { usePlatform } from '@/core/context/PlatformContext';
import { useApi } from '@/core/hooks/useApi';
import { Drama } from '@/core/types';
import { CarouselSkeleton } from '@/components/ui/loading-skeleton';
import { Link } from 'react-router-dom';

const RankingPage: React.FC = () => {
  const { currentPlatform } = usePlatform();
  const api = useApi();
  const [loading, setLoading] = useState(true);
  const [rankings, setRankings] = useState<Drama[]>([]);

  useEffect(() => {
    const fetchRankings = async () => {
      setLoading(true);
      try {
        const data = await api.getRanking();
        if (data.length === 0) {
          // Use mock data if API returns empty
          const homeData = await api.getHome();
          setRankings(homeData.dramas || []);
        } else {
          setRankings(data);
        }
      } catch (error) {
        console.error('Failed to fetch rankings:', error);
        const homeData = await api.getHome();
        setRankings(homeData.dramas || []);
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, [currentPlatform.id]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-500/20 to-transparent border-yellow-500/30';
      case 2:
        return 'bg-gradient-to-r from-gray-400/20 to-transparent border-gray-400/30';
      case 3:
        return 'bg-gradient-to-r from-amber-600/20 to-transparent border-amber-600/30';
      default:
        return 'glass';
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Trophy className="w-8 h-8 text-yellow-400" />
            <h1 className="font-display text-3xl md:text-4xl font-bold">
              Top Rankings
            </h1>
          </div>
          <p className="text-muted-foreground">
            Most popular dramas on {currentPlatform.name}
          </p>
        </div>

        {/* Rankings List */}
        {loading ? (
          <>
            <CarouselSkeleton />
            <CarouselSkeleton />
          </>
        ) : (
          <div className="max-w-4xl mx-auto space-y-4">
            {rankings.slice(0, 20).map((drama, index) => (
              <Link
                key={drama.id}
                to={`/drama/${drama.id}`}
                className={`flex items-center gap-4 p-4 rounded-xl border transition-all hover:scale-[1.02] ${getRankBg(index + 1)}`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Rank */}
                <div className="w-12 flex justify-center">
                  {getRankIcon(index + 1)}
                </div>

                {/* Poster */}
                <div className="w-16 h-24 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={drama.cover}
                    alt={drama.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg line-clamp-1 mb-1">
                    {drama.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    {drama.rating && drama.rating > 0 && (
                      <span className="flex items-center gap-1">
                        ⭐ {drama.rating.toFixed(1)}
                      </span>
                    )}
                    {drama.episodes && drama.episodes > 0 && (
                      <span>{drama.episodes} Eps</span>
                    )}
                    {drama.genre && drama.genre.length > 0 && (
                      <span className="hidden sm:inline">
                        {Array.isArray(drama.genre) ? drama.genre.slice(0, 2).join(' • ') : drama.genre}
                      </span>
                    )}
                  </div>
                </div>

                {/* Trending indicator */}
                <div className="hidden sm:flex items-center gap-1 text-sm" style={{ color: currentPlatform.color }}>
                  <span>🔥</span>
                  <span>Hot</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RankingPage;
