import React, { useState, useCallback } from 'react';
import { Search, X, Loader2, AlertCircle } from 'lucide-react';
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
  const [error, setError] = useState<string | null>(null);

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setSearched(false);
      setError(null);
      return;
    }

    setLoading(true);
    setSearched(true);
    setError(null);
    
    try {
      console.log(`🔍 Searching "${searchQuery}" on ${currentPlatform.name}...`);
      const data = await api.searchDrama(searchQuery);
      setResults(data);
      
      if (data.length === 0) {
        setError(`Tidak ada hasil untuk "${searchQuery}" di ${currentPlatform.name}`);
      }
    } catch (err: any) {
      console.error('Search failed:', err);
      setError(`Pencarian gagal: ${err.message}`);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [api, currentPlatform.name]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setSearched(false);
    setError(null);
  };

  const popularSearches = ['Romance', 'CEO', 'Historical', 'Fantasy', 'Revenge', 'Comedy'];

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4">
        {/* Search Header */}
        <div className="max-w-2xl mx-auto mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-center mb-2">
            Cari di {currentPlatform.name}
          </h1>
          <p className="text-center text-xs text-muted-foreground mb-6">
            API: {currentPlatform.api.baseUrl}
          </p>

          {/* Search Form */}
          <form onSubmit={handleSubmit} className="relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari judul drama..."
                className="w-full pl-12 pr-12 py-4 rounded-2xl glass border-2 border-transparent focus:border-primary transition-colors text-lg outline-none"
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
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl font-medium transition-all"
              style={{ backgroundColor: currentPlatform.color }}
            >
              Cari
            </button>
          </form>

          {/* Popular Searches */}
          {!searched && (
            <div className="mt-6">
              <p className="text-sm text-muted-foreground mb-3">Pencarian populer:</p>
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

          {/* Real API Badge */}
          <div className="flex justify-center mt-4">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
              ✓ Real API Search
            </span>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Mencari di {currentPlatform.name}...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Tidak Ditemukan</h3>
            <p className="text-muted-foreground">{error}</p>
          </div>
        ) : results.length > 0 ? (
          <div className="fade-in">
            <p className="text-muted-foreground mb-6">
              Ditemukan {results.length} hasil untuk "{query}"
            </p>
            <DramaGrid dramas={results} />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default SearchPage;
