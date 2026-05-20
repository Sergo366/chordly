'use client';

import { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGetClothes, useAddClothing } from '@/hooks/use-clothes';
import { useToast } from '@/hooks/useToast';
import dynamic from 'next/dynamic';
import ClothingCard from '@/components/wardrobe/ClothingCard';

const AddClothesModal = dynamic(
    () => import('@/components/modals/AddClothesModal/AddClothesModal').then(mod => mod.AddClothesModal),
    { ssr: false }
);
import WardrobeSidebar from '@/components/wardrobe/WardrobeSidebar';
import { ChevronLeft, Shirt, Plus } from 'lucide-react';
import { SPECIAL_SECTION_CONFIG } from '@/app/(main)/wardrobe/[category]/const';
import { useCategories } from '@/hooks/useCategories';
import { ICON_MAP } from '@/components/ui/IconPicker';
import { UploadChoiceModal } from '@/components/modals/UploadChoiceModal/UploadChoiceModal';
import { Category } from '@/shared/clothes';

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddClothesModalOpen, setIsAddClothesModalOpen] = useState(false);
  const { toast } = useToast();
  const { data: uploadData, mutate: addClothing } = useAddClothing();
  const categoryIdOrSlug = decodeURIComponent(params.category as string);
  const { data: clothes, isLoading: isLoadingClothes } = useGetClothes();
  const { data: categories, isLoading: isLoadingCategories } = useCategories();

  const currentCategory = useMemo(() => {
    return categories?.find(c => c.id === categoryIdOrSlug);
  }, [categories, categoryIdOrSlug]);

  const specialConfig = SPECIAL_SECTION_CONFIG[categoryIdOrSlug];

  const categoryItems = useMemo(() => {
    if (!clothes) return [];

    if (specialConfig) {
      return clothes.filter(specialConfig.filter);
    }

    // Regular clothing category — hide hidden items
    return clothes.filter(item =>
      !item.isHidden &&
      (item.category === categoryIdOrSlug || (currentCategory && item.category === currentCategory.name))
    );
  }, [clothes, categoryIdOrSlug, specialConfig, currentCategory]);

  const isLoading = isLoadingClothes || isLoadingCategories;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="mt-4 text-stone-500 font-medium animate-pulse">
          Loading {specialConfig?.label ?? currentCategory?.name ?? 'Category'}...
        </p>
      </div>
    );
  }

  const pageTitle = specialConfig?.label ?? currentCategory?.name ?? 'Category';
  const pageDescription = specialConfig?.description ?? `${categoryItems.length} items in your collection`;
  const EmptyIcon = (specialConfig?.iconName ? ICON_MAP[specialConfig.iconName] : null) ?? Shirt;
  const emptyIconClass = specialConfig?.iconClass ?? 'text-stone-600';
  const emptyMessage = specialConfig?.EmptyMessage ?? 'No items in this category yet.';

  const handleTagPhotoSelect = (file: File) => {
    setIsAddModalOpen(false);
    toast.success('Analyzing photo tag...');
    addClothing(file, {
        onSuccess: () => {
            setIsAddClothesModalOpen(true);
        },
        onError: (err) => {
            const getErrorMessage = (err: unknown) => {
                if (!err) return null;
                if (typeof err === 'object' && 'response' in err) {
                    const axiosError = err as { response: { data: { message?: string } } };
                    return axiosError.response?.data?.message || 'Upload failed. Please try again.';
                }
                return err instanceof Error ? err.message : String(err);
            };
            toast.error(getErrorMessage(err) || 'Failed to analyze clothes');
        }
    });
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-transparent">
      {/* Ambient backgrounds */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: -1 }}>
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[radial-gradient(circle,rgba(168,85,247,0.08)_0%,transparent_70%)] blur-[120px]" />
      </div>

      <div className="hidden md:block">
        <WardrobeSidebar 
          selectedCategory={categoryIdOrSlug} 
          onSelectCategory={(cat) => router.push(cat ? `/wardrobe/${cat}` : '/wardrobe')} 
        />
      </div>

      <div className="flex-1 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <button
              onClick={() => router.push('/wardrobe')}
              className="flex items-center gap-2 text-stone-400 hover:text-white transition-colors mb-8 group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </div>
              <span className="font-semibold tracking-tight">Back to overview</span>
            </button>

            <div className="flex items-baseline justify-between mb-12">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  {specialConfig && (
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/5">
                      <EmptyIcon className={`w-4 h-4 ${emptyIconClass}`} />
                    </div>
                  )}
                  <h1 className="text-4xl font-bold text-white tracking-tight">{pageTitle}</h1>
                </div>
                <p className="text-stone-500 mt-2 font-medium">
                  {specialConfig
                    ? `${categoryItems.length} ${pageDescription}`
                    : `${categoryItems.length} items in your collection`}
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-background font-semibold hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all cursor-pointer"
              >
                <Plus className="w-5 h-5 stroke-[2.5]" />
                Add new item
              </button>
            </div>

            {categoryItems.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {categoryItems.map(item => (
                  <ClothingCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 bg-white/[0.02] border border-dashed border-white/5 rounded-3xl">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4">
                  <EmptyIcon className={`w-8 h-8 ${emptyIconClass}`} />
                </div>
                <p className="text-stone-500 font-medium">{emptyMessage}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <UploadChoiceModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onTagPhotoSelect={handleTagPhotoSelect}
      />
      {uploadData && (
        <AddClothesModal 
            isOpen={isAddClothesModalOpen}
            onClose={() => setIsAddClothesModalOpen(false)}
            searchResults={uploadData.searchResults || []}
            ticker={uploadData.ticker}
            initialCategory={currentCategory?.name as Category}
        />
      )}
    </div>
  );
}



