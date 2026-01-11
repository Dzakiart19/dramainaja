import React from 'react';
import { Play, Sparkles, Zap, Globe } from 'lucide-react';
import { PLATFORM_LIST } from '@/core/config/platforms';
import { usePlatform } from '@/core/context/PlatformContext';
import { useNavigate } from 'react-router-dom';
import { PlatformId } from '@/core/types';

const LandingPage: React.FC = () => {
  const { setPlatform } = usePlatform();
  const navigate = useNavigate();

  const handlePlatformSelect = (platformId: PlatformId) => {
    setPlatform(platformId);
    navigate('/browse');
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-hero-gradient opacity-50" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-platform-flickreels/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), 
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />

        <div className="container mx-auto px-4 relative z-10 text-center">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center pulse-glow">
              <Play className="w-8 h-8 text-primary-foreground fill-primary-foreground ml-1" />
            </div>
          </div>

          {/* Title */}
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6 glow-text">
            Dramain<span className="text-primary"> Aja</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Stream Chinese Drama dari <span className="text-primary font-semibold">15 Platform</span> dalam satu tempat.
            Tanpa login, langsung nonton!
          </p>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Globe className="w-5 h-5 text-primary" />
              <span>15 Platforms</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Zap className="w-5 h-5 text-primary" />
              <span>No Login Required</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Sparkles className="w-5 h-5 text-primary" />
              <span>Free Forever</span>
            </div>
          </div>

          {/* CTA */}
          <p className="text-muted-foreground mb-8">
            Pilih platform favoritmu untuk mulai menonton 👇
          </p>
        </div>
      </section>

      {/* Platform Grid */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-12">
            Pilih Platform Streaming
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {PLATFORM_LIST.map((platform, index) => (
              <button
                key={platform.id}
                onClick={() => handlePlatformSelect(platform.id)}
                className="platform-card group"
                style={{ 
                  backgroundColor: `${platform.color}15`,
                  borderColor: `${platform.color}30`,
                  borderWidth: '1px',
                  animationDelay: `${index * 0.05}s`
                }}
              >
                {/* Glow Effect */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                  style={{ 
                    background: `radial-gradient(circle at center, ${platform.color}30, transparent 70%)` 
                  }}
                />
                
                {/* Icon */}
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 mx-auto transition-transform group-hover:scale-110"
                  style={{ backgroundColor: platform.color }}
                >
                  <span className="font-display font-bold text-lg text-white">
                    {platform.name.slice(0, 2)}
                  </span>
                </div>

                {/* Name */}
                <h3 className="font-semibold text-center relative z-10">
                  {platform.name}
                </h3>

                {/* Menu count */}
                <p className="text-xs text-muted-foreground text-center mt-1 relative z-10">
                  {platform.menu.length} menus
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-white/10">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground text-sm">
            © 2025 Dramain Aja. Streaming aggregator untuk Chinese Drama.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
