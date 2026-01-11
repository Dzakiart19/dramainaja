import React, { useState, useCallback } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { usePlatform } from '@/core/context/PlatformContext';
import { useApi } from '@/core/hooks/useApi';
import { Drama } from '@/core/types';
import { DramaGrid } from '@/components/drama/DramaGrid';

const SearchPage: React.FC = () => {
  const { currentPlatform } = usePlatform();
  const api = useApi();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Drama[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }

    setLoading(true);
    setSearched(true);
    try {
      const data = await api.searchDrama(searchQuery);
      setResults(data);
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [api]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setSearched(false);
  };

  const popularSearches = ['Romance', 'CEO', 'Historical', 'Fantasy', 'Action', 'Comedy'];

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4">
        {/* Search Header */}
        <div className="max-w-2xl mx-auto mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-center mb-6">
            Search on {currentPlatform.name}
          </h1>

          {/* Search Form */}
          <form onSubmit={handleSubmit} className="relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for drama titles..."
                className="w-full pl-12 pr-12 py-4 rounded-2xl glass border-2 border-transparent focus:border-primary transition-colors text-lg outline-none"
                style={{ '--tw-ring-color': currentPlatform.color } as React.CSSProperties}
              />
              {query && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </form>

          {/* Popular Searches */}
          {!searched && (
            <div className="mt-6">
              <p className="text-sm text-muted-foreground mb-3">Popular searches:</p>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      setQuery(term);
                      handleSearch(term);
                    }}
                    className="px-4 py-2 rounded-full glass text-sm font-medium hover:bg-white/20 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : searched && results.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">No results found</h3>
            <p className="text-muted-foreground">
              Try different keywords or browse our categories
            </p>
          </div>
        ) : results.length > 0 ? (
          <div className="fade-in">
            <p className="text-muted-foreground mb-6">
              Found {results.length} results for "{query}"
            </p>
            <DramaGrid dramas={results} />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default SearchPage;
