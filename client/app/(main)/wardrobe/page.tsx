'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGetClothes } from '@/hooks/use-clothes';
import { Clothing } from '@/api/clothes';
import WardrobeCategory from '@/components/wardrobe/WardrobeCategory';
import WardrobeSidebar from '@/components/wardrobe/WardrobeSidebar';
import { Sparkles } from 'lucide-react';
import { SPECIAL_SECTION_CONFIG } from '@/app/(main)/wardrobe/[category]/const';
import { useCategories } from '@/hooks/useCategories';
import { WardrobePageMenu } from '@/components/wardrobe/wardrobePageMenu';
import { Category } from '@/api/categories';

export default function WardrobePage() {
  const router = useRouter();
  const [showHidden, setShowHidden] = useState(false);
  const { data: clothes, isLoading: isLoadingClothes } = useGetClothes();
  const { data: categoriesData, isLoading: isLoadingCategories } = useCategories()
  const isLoading = isLoadingCategories || isLoadingClothes;

  const filteredClothes = useMemo(() => {
    if (!clothes) return [];
    return clothes.filter(item => !item.isHidden);
  }, [clothes]);

  const groupedClothes = useMemo(() => {
    const groups: Record<string, { id: string; name: string; items: Clothing[]; isHidden: boolean; category: Category }> = {};

    categoriesData?.forEach(cat => {
      if (cat.isHidden && !showHidden) return;
      groups[cat.id] = { id: cat.id, name: cat.name, items: [], isHidden: cat.isHidden, category: cat };
    });

    filteredClothes.forEach((item: Clothing) => {
      const categoryIdOrName = item.category as string;
      
      // Try by ID first
      if (categoryIdOrName && groups[categoryIdOrName]) {
        groups[categoryIdOrName].items.push(item);
        return;
      }

      // Try by name as fallback
      const catObj = categoriesData?.find(c => c.name === categoryIdOrName);
      if (catObj && groups[catObj.id]) {
        groups[catObj.id].items.push(item);
      }
    });

    return groups;
  }, [categoriesData, filteredClothes, showHidden]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="mt-4 text-stone-500 font-medium animate-pulse">Organizing your wardrobe...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-transparent">
      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: -1 }}>
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[radial-gradient(circle,rgba(168,85,247,0.08)_0%,transparent_70%)] blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[radial-gradient(circle,rgba(212,196,168,0.05)_0%,transparent_70%)] blur-[120px]" />
      </div>

      {/* Sidebar - Persistent on Desktop */}
      <div className="hidden md:block">
        <WardrobeSidebar 
          selectedCategory={null} 
          onSelectCategory={(cat) => cat && router.push(`/wardrobe/${cat}`)} 
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-in fade-in slide-in-from-left-4 duration-500">
            <header className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/5 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                </div>
                <span className="text-stone-400 font-bold tracking-[0.4em] uppercase text-[9px]">Collection</span>
              </div>
              <div className="w-full">
                <h1 className="text-5xl font-extrabold text-white tracking-tight">Your Wardrobe</h1>
                <div className={"flex justify-between"}>
                  <p className="text-stone-300 mt-4 text-lg max-w-2xl leading-relaxed font-medium">
                    Manage your personal style collection. Explore categories to see
                    every detail and refine your seasonal looks.
                  </p>
                  <WardrobePageMenu 
                    showHidden={showHidden} 
                    onToggleShowHidden={() => setShowHidden(!showHidden)} 
                  />
                </div>
              </div>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.values(groupedClothes).map((group) => (
                <WardrobeCategory
                  key={group.id}
                  categoryId={group.id}
                  categoryName={group.name}
                  items={group.items}
                  isHidden={group.isHidden}
                  category={group.category}
                  onOpen={(id) => router.push(`/wardrobe/${id}`)}
                />
              ))}
            </div>

            {/* Collections divider */}
            <div className="flex items-center gap-4 mt-12 mb-6">
              <div className="h-px flex-1 bg-white/5" />
              <span className="text-xs font-bold text-stone-500 uppercase tracking-widest">Collections</span>
              <div className="h-px flex-1 bg-white/5" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {Object.entries(SPECIAL_SECTION_CONFIG).map(([slug, config]) => {
                const collectionItems = clothes ? clothes.filter(config.filter) : [];
                return (
                  <WardrobeCategory
                    key={slug}
                    categoryId={slug}
                    categoryName={config.label}
                    items={collectionItems}
                    onOpen={(id) => router.push(`/wardrobe/${id}`)}
                    titleIcon={config.Icon}
                    hideMenu={true}
                  />
                );
              })}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}