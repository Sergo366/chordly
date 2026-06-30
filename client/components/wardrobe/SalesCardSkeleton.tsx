'use client';

export default function SalesCardSkeleton() {
  return (
    <div className="bg-[#1A1A1E] border border-white/[0.05] rounded-2xl overflow-hidden">
      {/* Image skeleton */}
      <div className="aspect-[3/4] bg-[#16161a] animate-pulse" />
      
      {/* Content skeleton */}
      <div className="p-4 bg-[#1A1A1E] space-y-3">
        {/* Title skeleton */}
        <div className="h-4 bg-white/10 rounded-lg animate-pulse w-3/4" />
        
        {/* Type skeleton */}
        <div className="h-3 bg-white/5 rounded-lg animate-pulse w-1/2" />
        
        {/* Price skeleton */}
        <div className="h-5 bg-green-500/10 rounded-lg animate-pulse w-1/3 mt-2" />
      </div>
    </div>
  );
}
