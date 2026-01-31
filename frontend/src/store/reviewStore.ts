import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ReviewFilter {
  category: number[];
  verificationStatus: number[];
  minRating: number;
  maxRating: number;
  tags: number[];
}

interface ReviewStore {
  filters: ReviewFilter;
  searchQuery: string;
  sortBy: 'rating' | 'reviews' | 'date' | 'trending';
  setFilters: (filters: Partial<ReviewFilter>) => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sortBy: ReviewStore['sortBy']) => void;
  resetFilters: () => void;
}

const defaultFilters: ReviewFilter = {
  category: [],
  verificationStatus: [],
  minRating: 0,
  maxRating: 5,
  tags: [],
};

export const useReviewStore = create<ReviewStore>()(
  persist(
    (set) => ({
      filters: defaultFilters,
      searchQuery: '',
      sortBy: 'rating',

      setFilters: (newFilters) =>
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        })),

      setSearchQuery: (query) =>
        set({ searchQuery: query }),

      setSortBy: (sortBy) =>
        set({ sortBy }),

      resetFilters: () =>
        set({
          filters: defaultFilters,
          searchQuery: '',
          sortBy: 'rating',
        }),
    }),
    {
      name: 'basereview-filters',
    }
  )
);
