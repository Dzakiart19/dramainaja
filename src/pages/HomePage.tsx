import React, { useEffect, useState } from 'react';
import { usePlatform } from '@/core/context/PlatformContext';
import { useApi } from '@/core/hooks/useApi';
import { Drama, HomeData } from '@/core/types';
import { HeroBanner } from '@/components/drama/HeroBanner';
import { DramaCarousel } from '@/components/drama/DramaCarousel';
import { HeroBannerSkeleton, CarouselSkeleton } from '@/components/ui/loading-skeleton';

// Fallback mock dramas in case API fails
const MOCK_DRAMAS: Drama[] = [
  {
    id: '1',
    title: 'Love in the Moonlight',
    cover: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=400&h=600&fit=crop',
    description: 'A romantic drama set in ancient times with beautiful cinematography',
    rating: 9.2,
    episodes: 24,
    genre: ['Romance', 'Historical'],
    year: '2024',
  },
  {
    id: '2',
    title: 'CEO\'s Secret Love',
    cover: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
    description: 'Modern romance between CEO and assistant',
    rating: 8.8,
    episodes: 30,
    genre: ['Romance', 'Modern'],
    year: '2024',
  },
  {
    id: '3',
    title: 'Eternal Promise',
    cover: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=600&fit=crop',
    description: 'Fantasy romance across dimensions',
    rating: 9.0,
    episodes: 40,
    genre: ['Fantasy', 'Romance'],
    year: '2023',
  },
  {
    id: '4',
    title: 'Royal Intrigue',
    cover: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=600&fit=crop',
    description: 'Palace drama with unexpected twists',
    rating: 8.7,
    episodes: 36,
    genre: ['Historical', 'Drama'],
    year: '2024',
  },
  {
    id: '5',
    title: 'Hidden Love',
    cover: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=600&fit=crop',
    description: 'Sweet campus romance story',
    rating: 9.1,
    episodes: 25,
    genre: ['Romance', 'Youth'],
    year: '2023',
  },
  {
    id: '6',
    title: 'Sword Dynasty',
    cover: 'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=400&h=600&fit=crop',
    description: 'Epic martial arts adventure',
    rating: 8.9,
    episodes: 50,
    genre: ['Action', 'Wuxia'],
    year: '2024',
  },
  {
    id: '7',
    title: 'My Little Happiness',
    cover: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop',
    description: 'Heartwarming slice of life romance',
    rating: 8.6,
    episodes: 28,
    genre: ['Romance', 'Comedy'],
    year: '2024',
  },
  {
    id: '8',
    title: 'The Untamed',
    cover: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=600&fit=crop',
    description: 'Epic cultivation fantasy adventure',
    rating: 9.5,
    episodes: 50,
    genre: ['Fantasy', 'Adventure'],
    year: '2023',
  },
];

const HomePage: React.FC = () => {
  const { currentPlatform } = usePlatform();
  const api = useApi();
  const [loading, setLoading] = useState(false);
  const [homeData, setHomeData] = useState<HomeData>({ dramas: MOCK_DRAMAS });

  useEffect(() => {
    const fetchHome = async () => {
      // Set a timeout of 5 seconds, then use mock data
      const timeoutPromise = new Promise<HomeData>((resolve) => {
        setTimeout(() => {
          resolve({ dramas: MOCK_DRAMAS });
        }, 5000);
      });

      try {
        const dataPromise = api.getHome();
        const data = await Promise.race([dataPromise, timeoutPromise]);
        
        // If data is empty, use mock data
        if (!data.dramas?.length && !data.sections?.length && !data.banners?.length) {
          setHomeData({ dramas: MOCK_DRAMAS });
        } else {
          setHomeData(data);
        }
      } catch (error) {
        console.error('Failed to fetch home data:', error);
        setHomeData({ dramas: MOCK_DRAMAS });
      } finally {
        setLoading(false);
      }
    };

    fetchHome();
  }, [currentPlatform.id]);

  const featuredDrama = homeData?.banners?.[0] || homeData?.dramas?.[0];
  const allDramas = homeData?.dramas || MOCK_DRAMAS;
  const sections = homeData?.sections || [];

  // Create sections from dramas if no sections exist
  const displaySections = sections.length > 0 
    ? sections 
    : [
        { title: '🔥 Trending Now', items: allDramas.slice(0, 8) },
        { title: '💝 Romance', items: [...allDramas.slice(2), ...allDramas.slice(0, 2)].slice(0, 8) },
        { title: '⚔️ Action & Adventure', items: [...allDramas.slice(4), ...allDramas.slice(0, 4)].slice(0, 8) },
        { title: '🏯 Historical Drama', items: [...allDramas.slice(1), ...allDramas.slice(0, 1)].slice(0, 8) },
      ].filter(section => section.items.length > 0);

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4">
        {/* Hero Banner */}
        {loading ? (
          <HeroBannerSkeleton />
        ) : featuredDrama ? (
          <div className="fade-in">
            <HeroBanner drama={featuredDrama} />
          </div>
        ) : null}

        {/* Drama Sections */}
        {loading ? (
          <>
            <CarouselSkeleton />
            <CarouselSkeleton />
            <CarouselSkeleton />
          </>
        ) : (
          displaySections.map((section, index) => (
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
          ))
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
              <h3 className="font-display text-lg font-bold">Currently browsing {currentPlatform.name}</h3>
              <p className="text-sm text-muted-foreground">
                Switch platforms anytime using the dropdown in the navbar
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
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
