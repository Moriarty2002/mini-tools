import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';

interface FavoritesContextValue {
  favorites: string[];
  recentTools: string[];
  isFavorite: (slug: string) => boolean;
  toggleFavorite: (slug: string) => void;
  recordToolUsage: (slug: string) => void;
}

const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined);

const FAVORITES_KEY = 'minitools_favorite_slugs';
const RECENTS_KEY = 'minitools_recent_slugs';

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_KEY);
      return saved ? JSON.parse(saved) : ['price-per-kg'];
    } catch {
      return ['price-per-kg'];
    }
  });

  const [recentTools, setRecentTools] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(RECENTS_KEY);
      return saved ? JSON.parse(saved) : ['price-per-kg'];
    } catch {
      return ['price-per-kg'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch {
      // ignore
    }
  }, [favorites]);

  useEffect(() => {
    try {
      localStorage.setItem(RECENTS_KEY, JSON.stringify(recentTools));
    } catch {
      // ignore
    }
  }, [recentTools]);

  const isFavorite = useCallback(
    (slug: string) => favorites.includes(slug),
    [favorites]
  );

  const toggleFavorite = useCallback((slug: string) => {
    setFavorites((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  }, []);

  const recordToolUsage = useCallback((slug: string) => {
    setRecentTools((prev) => {
      if (prev[0] === slug) return prev;
      const filtered = prev.filter((s) => s !== slug);
      return [slug, ...filtered].slice(0, 6);
    });
  }, []);

  const contextValue = useMemo(
    () => ({
      favorites,
      recentTools,
      isFavorite,
      toggleFavorite,
      recordToolUsage,
    }),
    [favorites, recentTools, isFavorite, toggleFavorite, recordToolUsage]
  );

  return (
    <FavoritesContext.Provider value={contextValue}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = (): FavoritesContextValue => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
