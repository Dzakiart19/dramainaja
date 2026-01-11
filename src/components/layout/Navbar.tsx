import React, { useState } from 'react';
import { Menu, X, ChevronDown, Search, Bookmark, Play } from 'lucide-react';
import { usePlatform } from '@/core/context/PlatformContext';
import { PLATFORM_LIST } from '@/core/config/platforms';
import { PlatformId, MenuItemType } from '@/core/types';
import { Link, useLocation } from 'react-router-dom';

const MENU_ICONS: Record<MenuItemType, string> = {
  home: '🏠',
  latest: '🆕',
  search: '🔍',
  rank: '🏆',
  bookmark: '❤️',
  trending: '🔥',
  exchange: '🔄',
  categories: '📂',
  collections: '📚',
  discover: '🧭',
  meta: 'ℹ️',
  episodes: '📺',
  batch: '📦',
  unlock: '🔓',
  tabs: '📑',
  episode: '▶️',
  feed: '📰',
  play: '▶️',
  foryou: '✨',
  classify: '🏷️',
  watch: '👁️',
  program: '📋',
  list: '📋',
  drama: '🎬',
  detail: '📖',
  video: '🎥',
  ranking: '🏆',
  recommend: '💡',
  init: '🚀',
  browse: '🌐',
  book: '📕',
};

const MENU_LABELS: Record<MenuItemType, string> = {
  home: 'Home',
  latest: 'Latest',
  search: 'Search',
  rank: 'Ranking',
  bookmark: 'Bookmark',
  trending: 'Trending',
  exchange: 'Exchange',
  categories: 'Categories',
  collections: 'Collections',
  discover: 'Discover',
  meta: 'Info',
  episodes: 'Episodes',
  batch: 'Batch',
  unlock: 'Unlock',
  tabs: 'Tabs',
  episode: 'Episode',
  feed: 'Feed',
  play: 'Play',
  foryou: 'For You',
  classify: 'Classify',
  watch: 'Watch',
  program: 'Program',
  list: 'List',
  drama: 'Drama',
  detail: 'Detail',
  video: 'Video',
  ranking: 'Ranking',
  recommend: 'Recommend',
  init: 'Start',
  browse: 'Browse',
  book: 'Book',
};

export const Navbar: React.FC = () => {
  const { currentPlatform, setPlatform } = usePlatform();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [platformDropdownOpen, setPlatformDropdownOpen] = useState(false);
  const location = useLocation();

  const handlePlatformChange = (platformId: PlatformId) => {
    setPlatform(platformId);
    setPlatformDropdownOpen(false);
  };

  const getMenuRoute = (item: MenuItemType): string => {
    if (item === 'home' || item === 'foryou' || item === 'discover' || item === 'list' || item === 'init') {
      return '/';
    }
    return `/${item}`;
  };

  const isActiveRoute = (item: MenuItemType): boolean => {
    const route = getMenuRoute(item);
    if (route === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(route);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Platform Switcher */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              <Play className="w-8 h-8 text-primary fill-primary" />
              <span className="font-display text-xl font-bold glow-text">Dramain Aja</span>
            </Link>

            {/* Platform Switcher */}
            <div className="relative">
              <button
                onClick={() => setPlatformDropdownOpen(!platformDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full glass text-sm font-medium hover:bg-white/10 transition-colors"
                style={{ borderColor: currentPlatform.color }}
              >
                <span 
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: currentPlatform.color }}
                />
                <span>{currentPlatform.name}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${platformDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {platformDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 glass rounded-xl py-2 shadow-2xl max-h-96 overflow-y-auto">
                  {PLATFORM_LIST.map((platform) => (
                    <button
                      key={platform.id}
                      onClick={() => handlePlatformChange(platform.id)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/10 transition-colors text-left ${
                        currentPlatform.id === platform.id ? 'bg-white/5' : ''
                      }`}
                    >
                      <span 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: platform.color }}
                      />
                      <span className="font-medium">{platform.name}</span>
                      {currentPlatform.id === platform.id && (
                        <span className="ml-auto text-primary">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            {currentPlatform.menu.slice(0, 5).map((item) => (
              <Link
                key={item}
                to={getMenuRoute(item)}
                className={`nav-link px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActiveRoute(item) ? 'nav-link-active bg-white/5' : ''
                }`}
              >
                <span className="mr-1.5">{MENU_ICONS[item]}</span>
                {MENU_LABELS[item]}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <Link to="/search" className="p-2 rounded-lg hover:bg-white/10 transition-colors">
              <Search className="w-5 h-5" />
            </Link>
            <Link to="/bookmark" className="p-2 rounded-lg hover:bg-white/10 transition-colors hidden sm:flex">
              <Bookmark className="w-5 h-5" />
            </Link>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <div className="flex flex-col gap-1">
              {currentPlatform.menu.map((item) => (
                <Link
                  key={item}
                  to={getMenuRoute(item)}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActiveRoute(item) ? 'bg-white/10 text-foreground' : 'text-muted-foreground hover:bg-white/5'
                  }`}
                >
                  <span className="text-lg">{MENU_ICONS[item]}</span>
                  <span className="font-medium">{MENU_LABELS[item]}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Backdrop for dropdowns */}
      {platformDropdownOpen && (
        <div 
          className="fixed inset-0 z-[-1]" 
          onClick={() => setPlatformDropdownOpen(false)}
        />
      )}
    </nav>
  );
};
