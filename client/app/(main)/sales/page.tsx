'use client';

import { useEffect } from 'react';
import { useGetSalesInfinite } from '@/hooks/use-clothes';
import SalesCard from '@/components/wardrobe/SalesCard';
import SalesCardSkeleton from '@/components/wardrobe/SalesCardSkeleton';
import { ShoppingBag, Package } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

export default function SalesPage() {
  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetSalesInfinite();
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allSales = data?.pages.flatMap((page) => page.data) || [];
  const totalItems = data?.pages[0]?.meta.total || 0;

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
