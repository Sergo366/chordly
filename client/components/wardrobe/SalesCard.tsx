'use client';

import React from 'react';
import Image from 'next/image';
import { DollarSign, Tag, Heart } from 'lucide-react';
import { Clothing } from '@/api/clothes';

interface SalesCardProps {
  item: Clothing;
  className?: string;
}

export default function SalesCard({ item, className = '' }: SalesCardProps) {
  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div 
      className={`group relative bg-[#1A1A1E] border border-white/[0.05] rounded-2xl hover:bg-[#232329] transition-all duration-300 shadow-sm hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] active:scale-[0.98] cursor-pointer overflow-hidden ${className}`}
    >
      {/* Soft Glass highlight line */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none z-20">
        <div className="absolute inset-x-0 top-0 h-[0.5px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>
      
      {/* Sale Badge */}
      <div className="absolute top-3 left-3 z-20">
        <div className="bg-green-500/20 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-green-500/20 flex items-center gap-1.5">
          <DollarSign className="w-3.5 h-3.5 text-green-400" />
          <span className="text-[10px] font-bold text-green-400 uppercase tracking-wider">For Sale</span>
        </div>
      </div>

      {/* Favorite indicator */}
      {item.isFavorite && (
        <div className="absolute top-3 right-3 z-20">
          <div className="bg-primary/20 backdrop-blur-md p-1.5 rounded-full border border-primary/20">
            <Heart className="w-3.5 h-3.5 text-primary fill-primary" />
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div className="relative z-0">
        <div className="aspect-[3/4] relative">
          {item.imageUrl ? (
            <Image
              src={item.imageUrl}
              alt={item.title || 'Clothing item'}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
          ) : (
            <div className="w-full h-full bg-[#16161a] flex items-center justify-center">
              <Tag className="w-8 h-8 text-white/10 group-hover:text-white/20 transition-colors" />
            </div>
          )}
        </div>
        
        <div className="p-4 bg-[#1A1A1E]">
          <h3 className="text-sm font-semibold text-white truncate group-hover:text-primary transition-colors">
            {item.userTitle || item.title || 'Untitled'}
          </h3>
          <p className="text-[10px] text-stone-400 mt-1 uppercase tracking-widest font-bold">
            {item.type || 'Other'}
          </p>
          
          {/* Price Section */}
          {item.sale && (
            <div className="mt-3 pt-3 border-t border-white/5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold text-green-400">
                    {formatPrice(item.sale.price, item.sale.currency)}
                  </p>
                  {item.sale.isNegotiable && (
                    <p className="text-[9px] text-stone-500 mt-0.5">Price negotiable</p>
                  )}
                </div>
              </div>
              {item.sale.description && (
                <p className="text-[10px] text-stone-400 mt-2 line-clamp-2">
                  {item.sale.description}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
