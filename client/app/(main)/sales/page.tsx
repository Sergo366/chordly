'use client';

import { useEffect, useState, useRef } from 'react';
import { useGetSalesInfinite } from '@/hooks/use-clothes';
import SalesCard from '@/components/wardrobe/SalesCard';
import SalesCardSkeleton from '@/components/wardrobe/SalesCardSkeleton';
import { ShoppingBag, Package, Search, ArrowUpDown } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

type SortOption = 'newest' | 'oldest' | 'price-asc' | 'price-desc' | 'none';

export default function SalesPage() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [inputValue, setInputValue] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState<SortOption>((searchParams.get('sort') as SortOption) || 'none');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const sortMenuRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetSalesInfinite(searchQuery, sortBy);
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Update URL params when search or sort changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (searchQuery) {
      params.set('search', searchQuery);
    } else {
      params.delete('search');
    }
    if (sortBy !== 'none') {
      params.set('sort', sortBy);
    } else {
      params.delete('sort');
    }
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  }, [searchQuery, sortBy, searchParams]);

  // Clean up URL params on unmount
  useEffect(() => {
    return () => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete('search');
      params.delete('sort');
      const newUrl = `${window.location.pathname}`;
      window.history.replaceState({}, '', newUrl);
    };
  }, [searchParams]);

  // Debounced search handler
  const debouncedSearch = useDebouncedCallback(
    (value: string) => {
      setSearchQuery(value);
    },
    500
  );

  // Update search query when input changes (debounced)
  useEffect(() => {
    debouncedSearch(inputValue);
  }, [inputValue, debouncedSearch]);

  // Close sort menu on click outside or ESC
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortMenuRef.current && !sortMenuRef.current.contains(event.target as Node)) {
        setShowSortMenu(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowSortMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const allSales = data?.pages.flatMap((page) => page.data) || [];
  const totalItems = data?.pages[0]?.meta.total || 0;

  const sortOptions = [
    { value: 'none' as SortOption, label: 'No sorting' },
    { value: 'newest' as SortOption, label: 'Newest first' },
    { value: 'oldest' as SortOption, label: 'Oldest first' },
    { value: 'price-asc' as SortOption, label: 'Price: Low to High' },
    { value: 'price-desc' as SortOption, label: 'Price: High to Low' },
  ];

  return (
    <div className="min-h-screen bg-[#0D0D0F]">
      {/* Header */}
      <div className="border-b border-white/[0.05] bg-[#0D0D0F]/80 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 pb-3">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2.5 rounded-xl border border-primary/20">
              <ShoppingBag className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Sales</h1>
              <p className="text-stone-400 text-sm mt-0.5">Browse items available for purchase</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Sort Bar */}
      <div className="border-b border-white/[0.05] bg-[#0D0D0F]/60 backdrop-blur-xl sticky top-[73px] z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
              <input
                type="text"
                placeholder="Search items..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-stone-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
              />
            </div>

            {/* Sort Button */}
            <div className="relative" ref={sortMenuRef}>
              <button
                onClick={() => setShowSortMenu(!showSortMenu)}
                className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white hover:bg-white/10 transition-all"
              >
                <ArrowUpDown className="w-4 h-4" />
                <span>Sort</span>
              </button>

              {showSortMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-[#1A1A1E]/95 backdrop-blur-3xl border border-white/10 rounded-xl shadow-[0_30px_60px_rgba(0,0,0,0.6)] z-50 overflow-hidden">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSortBy(option.value);
                        setShowSortMenu(false);
                      }}
                      className={`w-full text-left px-4 py-3 text-sm transition-all ${
                        sortBy === option.value
                          ? 'bg-primary/20 text-primary'
                          : 'text-stone-300 hover:bg-white/5'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <SalesCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
            <div className="bg-red-500/10 p-4 rounded-full border border-red-500/20 mb-4">
              <Package className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Failed to load sales</h2>
            <p className="text-stone-400">Please try again later</p>
          </div>
        ) : allSales.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-stone-400 text-sm">
                {totalItems} item{totalItems !== 1 ? 's' : ''} for sale
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {allSales.map((item) => (
                <SalesCard key={item.id} item={item} />
              ))}
            </div>
            {/* Infinite scroll trigger */}
            {hasNextPage && (
              <div ref={ref} className="mt-4">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <SalesCardSkeleton key={i} />
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
            <div className="bg-white/5 p-4 rounded-full border border-white/10 mb-4">
              <ShoppingBag className="w-8 h-8 text-stone-400" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">No items for sale</h2>
            <p className="text-stone-400">Check back later for new listings</p>
          </div>
        )}
      </div>
    </div>
  );
}
