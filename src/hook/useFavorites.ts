import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabase/client';

const STORAGE_KEY = 'favorites';

export function useFavorites(isLoggedIn: boolean = false) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  // Load favorites from localStorage (for anonymous users)
  const loadLocalFavorites = useCallback(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setFavorites(new Set(parsed));
      }
    } catch (err) {
      console.error('Failed to load local favorites:', err);
    }
  }, []);

  // Save favorites to localStorage
  const saveLocalFavorites = useCallback((favs: Set<string>) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...favs]));
    } catch (err) {
      console.error('Failed to save local favorites:', err);
    }
  }, []);

  // Fetch favorites from Supabase (for logged-in users)
  const fetchSupabaseFavorites = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('tool_id');

      if (error) {
        console.error('Error fetching favorites:', error);
        return;
      }

      const favoriteIds = new Set(data?.map(f => f.tool_id) || []);
      setFavorites(favoriteIds);
    } catch (err) {
      console.error('Failed to fetch favorites:', err);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchSupabaseFavorites();
    } else {
      loadLocalFavorites();
    }
  }, [isLoggedIn, fetchSupabaseFavorites, loadLocalFavorites]);

  const addFavorite = useCallback(async (toolId: string) => {
    // If logged in, save to Supabase
    if (isLoggedIn) {
      try {
        const { error } = await supabase
          .from('favorites')
          .insert({ tool_id: toolId });

        if (error) {
          console.error('Error adding favorite:', error);
          return { success: false, error: error.message };
        }

        setFavorites(prev => new Set([...prev, toolId]));
        return { success: true };
      } catch (err) {
        console.error('Failed to add favorite:', err);
        return { success: false, error: '添加失败' };
      }
    }

    // If not logged in, save to localStorage
    setFavorites(prev => {
      const newSet = new Set([...prev, toolId]);
      saveLocalFavorites(newSet);
      return newSet;
    });
    return { success: true };
  }, [isLoggedIn, saveLocalFavorites]);

  const removeFavorite = useCallback(async (toolId: string) => {
    // If logged in, remove from Supabase
    if (isLoggedIn) {
      try {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('tool_id', toolId);

        if (error) {
          console.error('Error removing favorite:', error);
          return { success: false, error: error.message };
        }

        setFavorites(prev => {
          const newSet = new Set(prev);
          newSet.delete(toolId);
          return newSet;
        });
        return { success: true };
      } catch (err) {
        console.error('Failed to remove favorite:', err);
        return { success: false, error: '移除失败' };
      }
    }

    // If not logged in, remove from localStorage
    setFavorites(prev => {
      const newSet = new Set(prev);
      newSet.delete(toolId);
      saveLocalFavorites(newSet);
      return newSet;
    });
    return { success: true };
  }, [isLoggedIn, saveLocalFavorites]);

  const toggleFavorite = useCallback(async (toolId: string) => {
    if (favorites.has(toolId)) {
      return await removeFavorite(toolId);
    } else {
      return await addFavorite(toolId);
    }
  }, [favorites, addFavorite, removeFavorite]);

  const isFavorite = useCallback((toolId: string) => {
    return favorites.has(toolId);
  }, [favorites]);

  return {
    favorites,
    loading,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    refreshFavorites: isLoggedIn ? fetchSupabaseFavorites : loadLocalFavorites,
  };
}
