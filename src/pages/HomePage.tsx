import React, { useEffect, useState } from 'react';
import { usePlatform } from '@/core/context/PlatformContext';
import { useApi } from '@/core/hooks/useApi';
import { Drama, HomeData } from '@/core/types';
import { HeroBanner } from '@/components/drama/HeroBanner';
import { DramaCarousel } from '@/components/drama/DramaCarousel';
import { HeroBannerSkeleton, CarouselSkeleton } from '@/components/ui/loading-skeleton';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';

const HomePage: React.FC = () => {
  const { currentPlatform } = usePlatform();
  const api = useApi();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [homeData, setHomeData] = useState<HomeData | null>(null);

  const fetchHome = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log(`📡 Fetching data from ${currentPlatform.name}...`);
      const data = await api.getHome();
      
      if (data.dramas.length === 0 && !data.banners?.length && !data.sections?.length) {
        setError(`Tidak ada data dari ${currentPlatform.name}. Coba platform lain.`);
      }
      
      setHomeData(data);
    } catch (err: any) {
      console.error('Failed to fetch home data:', err);
      setError(`Gagal memuat data dari ${currentPlatform.name}: ${err.message}`);
      setHomeData({ dramas: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHome();
  }, [currentPlatform.id]);

  const featuredDrama = homeData?.banners?.[0] || homeData?.dramas?.[0];
  const allDramas = homeData?.dramas || [];
  const sections = homeData?.sections || [];

  // Create sections from dramas if no sections exist
  const displaySections = sections.length > 0 
    ? sections 
    : allDramas.length > 0
    ? [
        { title: '🔥 Trending Now', items: allDramas.slice(0, 10) },
        { title: '💝 Romance', items: [...allDramas.slice(3), ...allDramas.slice(0, 3)].slice(0, 10) },
        { title: '⚔️ Action & Adventure', items: [...allDramas.slice(5), ...allDramas.slice(0, 5)].slice(0, 10) },
        { title: '🏯 Historical Drama', items: [...allDramas.slice(2), ...allDramas.slice(0, 2)].slice(0, 10) },
      ].filter(section => section.items.length > 0)
    : [];

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4">
        {/* Loading State */}
        {loading && (
          <>
            <HeroBannerSkeleton />
            <CarouselSkeleton />
            <CarouselSkeleton />
            <CarouselSkeleton />
          </>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-20">
            <AlertCircle className="w-16 h-16 text-destructive mb-4" />
            <h3 className="text-xl font-semibold mb-2">Terjadi Kesalahan</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">{error}</p>
            <button
              onClick={fetchHome}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105"
              style={{ backgroundColor: currentPlatform.color }}
            >
              <RefreshCw className="w-5 h-5" />
              Coba Lagi
            </button>
          </div>
        )}

        {/* Content */}
        {!loading && !error && allDramas.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-6xl mb-4">📺</div>
            <h3 className="text-xl font-semibold mb-2">Tidak Ada Data</h3>
            <p className="text-muted-foreground text-center mb-6">
              Platform {currentPlatform.name} tidak mengembalikan data. Coba platform lain.
            </p>
            <button
              onClick={fetchHome}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold glass hover:bg-white/20 transition-all"
            >
              <RefreshCw className="w-5 h-5" />
              Refresh
            </button>
          </div>
        )}

        {!loading && allDramas.length > 0 && (
          <>
            {/* Hero Banner */}
            {featuredDrama && (
              <div className="fade-in">
                <HeroBanner drama={featuredDrama} />
              </div>
            )}

            {/* Drama Sections */}
            {displaySections.map((section, index) => (
              <div 
                key={section.title} 
                className="slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <DramaCarousel
                  title={section.title}
                  dramas={section.items}
                />
              </div>
            ))}
          </>
        )}

        {/* Platform Info */}
        <div className="mt-12 p-6 glass-card rounded-2xl">
          <div className="flex items-center gap-4 mb-4">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center font-display font-bold text-lg"
              style={{ backgroundColor: currentPlatform.color }}
            >
              {currentPlatform.name.slice(0, 2)}
            </div>
            <div>
              <h3 className="font-display text-lg font-bold">
                {loading ? 'Memuat...' : `${allDramas.length} drama dari ${currentPlatform.name}`}
              </h3>
              <p className="text-sm text-muted-foreground">
                API: {currentPlatform.api.baseUrl}
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
              ✓ Real API
            </span>
            {currentPlatform.menu.map((item) => (
              <span 
                key={item}
                className="px-3 py-1 rounded-full text-xs font-medium glass"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
