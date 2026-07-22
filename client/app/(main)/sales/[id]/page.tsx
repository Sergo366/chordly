'use client';

import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  ArrowLeft, 
  MessageCircle, 
  Star, 
  ShieldCheck, 
  Package, 
  Clock, 
  Heart,
  Share2
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { clothesApi, Clothing } from '@/api/clothes';

export default function SaleDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [item, setItem] = useState<Clothing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // MOCK seller data - will be replaced with actual API later
  const mockSeller = {
    id: 'user123',
    name: 'Alex Johnson',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80',
    rating: 4.8,
    totalSales: 24,
    joinedDate: 'Jan 2023'
  };

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const data = await clothesApi.findById(params.id as string);
        setItem(data);
      } catch (err) {
        setError('Failed to load item');
        console.error('Error fetching item:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0F] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-[#0D0D0F] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error || 'Item not found'}</p>
          <button 
            onClick={() => router.back()}
            className="text-white hover:text-primary transition-colors"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number, currency: string) => {
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(price);
    } catch {
      return `${price} ${currency}`;
    }
  };

  // MOCK condition - will be added to API later
  const mockCondition = 'Excellent';

  return (
    <div className="min-h-screen bg-[#0D0D0F] pb-24">
      {/* Header Bar */}
      <div className="border-b border-white/[0.05] bg-[#0D0D0F]/80 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-stone-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Sales</span>
          </button>
          <div className="flex items-center gap-4">
            <button className="p-2 text-stone-400 hover:text-primary transition-colors bg-white/5 rounded-full">
              <Heart className="w-5 h-5" />
            </button>
            <button className="p-2 text-stone-400 hover:text-white transition-colors bg-white/5 rounded-full">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Left Column: Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-[3/4] relative rounded-3xl overflow-hidden border border-white/10 bg-[#16161a]">
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt={item.userTitle || item.title || 'Clothing item'}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-[#16161a] flex items-center justify-center">
                  <span className="text-stone-500">No image</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="space-y-8">

            {/* Title & Price */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-primary/20 text-primary text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-md">
                  {item.type || 'Other'}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-white mb-4">{item.userTitle || item.title || 'Untitled'}</h1>

              {item.sale && (
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-green-400">
                    {formatPrice(item.sale.price, item.sale.currency)}
                  </span>
                  {item.sale.isNegotiable && (
                    <span className="text-sm text-stone-400">Open to offers</span>
                  )}
                </div>
              )}
            </div>

            {/* Quick Specs */}
            <div className="grid grid-cols-2 gap-4">
              {item.brand && (
                <div className="bg-white/5 border border-white/5 rounded-xl p-4">
                  <p className="text-stone-500 text-xs uppercase mb-1">Brand</p>
                  <p className="text-white font-medium">{item.brand}</p>
                </div>
              )}
              {item.size && (
                <div className="bg-white/5 border border-white/5 rounded-xl p-4">
                  <p className="text-stone-500 text-xs uppercase mb-1">Size</p>
                  <p className="text-white font-medium">{item.size}</p>
                </div>
              )}
              <div className="bg-white/5 border border-white/5 rounded-xl p-4">
                <p className="text-stone-500 text-xs uppercase mb-1">Condition</p>
                <p className="text-white font-medium">{mockCondition} <span className="text-stone-500 text-[10px]">(MOCK)</span></p>
              </div>
              <div className="bg-white/5 border border-white/5 rounded-xl p-4">
                <p className="text-stone-500 text-xs uppercase mb-1">Shipping</p>
                <p className="text-white font-medium">Buyer pays</p>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Description</h3>
              <p className="text-stone-300 leading-relaxed text-sm">
                {item.sale?.description || 'No description provided.'}
              </p>
            </div>

            {/* Seller Info Section (Mock) */}
            <div className="bg-[#1A1A1E] border border-white/10 rounded-2xl p-6">
              <h3 className="text-sm text-stone-400 uppercase tracking-wider font-semibold mb-4">
                About the Seller <span className="text-stone-500 text-[10px]">(MOCK)</span>
              </h3>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="relative w-16 h-16 rounded-full overflow-hidden bg-white/10">
                  <Image 
                    src={mockSeller.avatarUrl}
                    alt={mockSeller.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-white flex items-center gap-2">
                    {mockSeller.name}
                    <ShieldCheck className="w-5 h-5 text-blue-400" />
                  </h4>
                  <div className="flex items-center gap-3 mt-1 text-sm text-stone-400">
                    <span className="flex items-center gap-1 text-yellow-400 font-medium">
                      <Star className="w-4 h-4 fill-yellow-400" />
                      {mockSeller.rating}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Package className="w-4 h-4" />
                      {mockSeller.totalSales} sales
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Joined {mockSeller.joinedDate}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <button 
                  className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3.5 px-6 rounded-xl transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  Buy Now
                </button>
                <button 
                  className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium py-3.5 px-6 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  Message Seller
                </button>
              </div>
              
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
