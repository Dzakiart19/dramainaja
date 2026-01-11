import React, { useState, useEffect } from 'react';
import { Bookmark, Trash2 } from 'lucide-react';
import { Drama } from '@/core/types';
import { DramaGrid } from '@/components/drama/DramaGrid';

const STORAGE_KEY = 'dramain_bookmarks';

const BookmarkPage: React.FC = () => {
  const [bookmarks, setBookmarks] = useState<Drama[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setBookmarks(JSON.parse(saved));
      } catch {
        setBookmarks([]);
      }
    }
  }, []);

  const clearAll = () => {
    localStorage.removeItem(STORAGE_KEY);
    setBookmarks([]);
  };

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Bookmark className="w-8 h-8 text-primary fill-primary" />
            <h1 className="font-display text-3xl md:text-4xl font-bold">
              My Bookmarks
            </h1>
          </div>
          
          {bookmarks.length > 0 && (
            <button
              onClick={clearAll}
              className="flex items-center gap-2 px-4 py-2 rounded-lg glass text-sm font-medium hover:bg-destructive/20 hover:text-destructive transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>
          )}
        </div>

        {/* Content */}
        {bookmarks.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold mb-2">No bookmarks yet</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Start adding dramas to your bookmark list to keep track of what you want to watch!
            </p>
          </div>
        ) : (
          <div className="fade-in">
            <p className="text-muted-foreground mb-6">
              {bookmarks.length} drama{bookmarks.length > 1 ? 's' : ''} saved
            </p>
            <DramaGrid dramas={bookmarks} />
          </div>
        )}
      </div>
    </div>
  );
};

export default BookmarkPage;
