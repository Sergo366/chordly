'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Shirt, MoreVertical, Heart, Sparkles, Trash2, DollarSign, EyeOff, Eye } from 'lucide-react';
import { Clothing } from '@/api/clothes';
import { ClothingDetailModal } from '../modals/ClothingDetailModal/ClothingDetailModal';
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import { useDeleteClothes, useUpdateClothes } from '@/hooks/use-clothes';
import { useToast } from '@/hooks/useToast';
import { useConfirmation } from '../modals/ConfirmationModal';
import { deleteConfirmationModalOptions } from './const';
import { SellClothingModal } from '@/components/modals/SellClothingModal';

interface ClothingCardProps {
  item: Clothing;
  className?: string;
}

export default function ClothingCard({ item, className = '' }: ClothingCardProps) {
  const { openConfirmation } = useConfirmation()
  const [isModalOpen, setIsModalOpen] = useState({ detailModal: false, sellModal: false });
  const { mutate: deleteClothes } = useDeleteClothes();
  const { mutate: updateClothes } = useUpdateClothes();
  const { toast } = useToast();

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateClothes({ 
      clothesId: item.id, 
      data: { isFavorite: !item.isFavorite } 
    }, {
      onSuccess: () => toast.success(item.isFavorite ? 'Removed from favorites' : 'Added to favorites')
    });
  };

  const handleToggleHide = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateClothes({ 
      clothesId: item.id, 
      data: { isHidden: !item.isHidden } 
    }, {
      onSuccess: () => toast.success(item.isHidden ? 'Item unhidden' : 'Item hidden')
    });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    openConfirmation({
      ...deleteConfirmationModalOptions,
      onConfirm: () => {
        deleteClothes(item.id, {
          onSuccess: () => toast.success('Item deleted')
        });
      }
    });
  };

  const handleToggleSell = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsModalOpen((prev) => ({...prev, sellModal: true}))
  };


const getClothingCardActions = (item: Clothing) => [
  {
    id: 'favorite',
    label: item.isFavorite ? 'Remove from Favorite' : 'Mark as Favorite',
    icon: Heart,
    onClick: handleToggleFavorite,
    iconClass: item.isFavorite ? 'text-primary fill-primary scale-110' : '',
    focusClass: 'bg-primary/10 text-primary',
  },
  {
    id: 'suggest',
    label: 'Suggest Match',
    icon: Sparkles,
    onClick: (e: React.MouseEvent) => { e.stopPropagation(); toast.success('Matching logic coming soon!'); },
    iconClass: 'text-amber-400',
    focusClass: 'bg-amber-400/10 text-amber-400',
  },
  {
    id: 'sell',
    label: item.isForSale ? 'Remove from Sale' : 'Sell Item',
    icon: DollarSign,
    onClick: handleToggleSell,
    iconClass: item.isForSale ? 'text-green-400 scale-110' : '',
    focusClass: 'bg-green-400/10 text-green-400',
  },
  {
    id: 'hide',
    label: item.isHidden ? 'Show Item' : 'Hide Item',
    icon: item.isHidden ? Eye : EyeOff,
    onClick: handleToggleHide,
    iconClass: item.isHidden ? '' : 'text-stone-500',
    focusClass: 'bg-white/10 text-white',
  }
];

  return (
    <>
      <div 
        onClick={() => setIsModalOpen((prev) => ({...prev, detailModal: true}))}
        className={`group relative bg-[#1A1A1E] border border-white/[0.05] rounded-2xl hover:bg-[#232329] transition-all duration-300 shadow-sm hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] active:scale-[0.98] cursor-pointer ${className} ${item.isHidden ? 'opacity-60' : ''}`}
      >
        {/* Soft Glass highlight line - placed in a high z-index wrapper that doesn't clip children */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none z-20">
          <div className="absolute inset-x-0 top-0 h-[0.5px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
        
        {/* Status Indicators */}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-2 items-start">
          {item.isFavorite && (
            <div className="bg-primary/20 backdrop-blur-md p-1.5 rounded-full border border-primary/20">
              <Heart className="w-3.5 h-3.5 text-primary fill-primary" />
            </div>
          )}
          {item.isHidden && (
            <div className="bg-black/40 backdrop-blur-md px-2 py-1 rounded-md border border-white/10 flex items-center gap-1.5">
              <EyeOff className="w-3 h-3 text-white/60" />
              <span className="text-[9px] font-bold text-white/60 uppercase tracking-wider">Hidden</span>
            </div>
          )}
          {item.isForSale && (
            <div className="bg-green-500/20 backdrop-blur-md px-2 py-1 rounded-md border border-green-500/20 flex items-center gap-1.5">
              <DollarSign className="w-3 h-3 text-green-400" />
              <span className="text-[9px] font-bold text-green-400 uppercase tracking-wider">Sale</span>
            </div>
          )}
        </div>

        {/* Action Menu (High z-index, outside clipping) */}
        <div className="absolute top-2 right-2 z-[60]">
          <Menu as="div" className="relative">
            {({ open }) => (
              <>
                {/* Active Menu Highlight (Card Glow/Border) */}
                {open && (
                  <div className="absolute -inset-[calc(0.5rem+1.5px)] -top-[calc(0.5rem+1.5px)] -right-[calc(0.5rem+1.5px)] rounded-[1.3rem] border-2 border-primary/40 pointer-events-none z-0 shadow-[0_0_30px_rgba(212,175,53,0.15)]" />
                )}
                
                <MenuButton 
                  onClick={(e) => e.stopPropagation()}
                  className={`
                    relative p-2 cursor-pointer rounded-full backdrop-blur-md transition-all duration-300 shadow-lg z-10
                    ${open 
                      ? 'bg-primary text-black border-transparent scale-110 shadow-primary/30 ring-4 ring-primary/20' 
                      : 'bg-black/40 text-white/70 hover:text-white border border-white/5 hover:bg-primary/50'}
                  `}
                >
                  <MoreVertical className="w-4 h-4" />
                </MenuButton>

                <Transition
                  as={React.Fragment}
                  enter="transition ease-out duration-150"
                  enterFrom="transform opacity-0 scale-95 -translate-y-2"
                  enterTo="transform opacity-100 scale-100 translate-y-0"
                  leave="transition ease-in duration-100"
                  leaveFrom="transform opacity-100 scale-100 translate-y-0"
                  leaveTo="transform opacity-0 scale-95 -translate-y-2"
                >
                  <MenuItems className="absolute right-0 mt-3 w-56 origin-top-right rounded-2xl bg-[#1A1A1E]/95 backdrop-blur-3xl border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.6)] focus:outline-none z-[100] overflow-hidden">
                    <div className="p-1.5 space-y-0.5">
                      {getClothingCardActions(item).map((action) => (
                        <MenuItem key={action.id}>
                          {({ focus }) => (
                            <button
                              onClick={action.onClick}
                              className={`${
                                focus ? action.focusClass : 'text-stone-300'
                              } flex w-full items-center gap-3 rounded-xl px-4 py-3 text-[13px] font-semibold transition-all cursor-pointer`}
                            >
                              <action.icon className={`w-4.5 h-4.5 transition-all duration-300 ${action.iconClass}`} />
                              <span>{action.label}</span>
                            </button>
                          )}
                        </MenuItem>
                      ))}
                    </div>
                    
                    <div className="border-t border-white/5 p-1.5 bg-black/20">
                      <MenuItem>
                        {({ focus }) => (
                          <button
                            onClick={handleDelete}
                            className={`${
                              focus ? 'bg-red-500/20 text-red-400' : 'text-stone-500'
                            } flex w-full items-center gap-3 rounded-xl px-4 py-3 text-[13px] font-semibold transition-all cursor-pointer`}
                          >
                            <Trash2 className="w-4.5 h-4.5" />
                            <span>Delete Item</span>
                          </button>
                        )}
                      </MenuItem>
                    </div>
                  </MenuItems>
                </Transition>
              </>
            )}
          </Menu>
        </div>
        
        {/* Main Content with overflow clipping */}
        <div className="rounded-2xl overflow-hidden relative z-0">
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
                <Shirt className="w-8 h-8 text-primary/10 group-hover:text-primary/20 transition-colors" />
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
          </div>
        </div>
      </div>

      <ClothingDetailModal 
        isOpen={isModalOpen.detailModal}
        onClose={() => setIsModalOpen((prev) => ({...prev, detailModal: false}))}
        item={item}
      />

      <SellClothingModal
        clothing={item}
        isOpen={isModalOpen.sellModal}
        onClose={() => setIsModalOpen((prev) => ({...prev, sellModal: false}))}
      />
    </>
  );
}
