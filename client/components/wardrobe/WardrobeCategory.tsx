'use client';

import React, { Fragment } from 'react';
import { Clothing } from '@/api/clothes';
import Image from 'next/image';
import { ChevronRight, Shirt, MoreVertical, EyeOff, Eye, Pencil, Trash2 } from 'lucide-react';
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import { CARD_STYLES, MENU_STYLES } from '@/lib/styles/header';
import { classNames } from '@/lib/styles/classNames';
import { DROPDOWN_TRANSITION } from '@/lib/styles/header';
import { useRemoveCategories } from '@/hooks/useCategories/useRemoveCategories';
import { useConfirmation } from '@/components/modals/ConfirmationModal';
import { useUpdateCategories } from '@/hooks/useCategories/useUpdateCategories';
import { CategoryModal } from '@/components/modals/AddCategoryModal';
import { Category } from '@/api/categories';

interface WardrobeCategoryProps {
  categoryId: string; // The ID of the category (or slug for special sections)
  categoryName: string; // The name of the category
  items: Clothing[];
  onOpen: (id: string) => void;
  titleIcon?: React.ElementType;
  hideMenu?: boolean;
  isHidden?: boolean;
  category?: Category;
}

export default function WardrobeCategory({ categoryId, categoryName, items, onOpen, titleIcon: TitleIcon, hideMenu, isHidden, category }: WardrobeCategoryProps) {
  const { mutate: removeCategory } = useRemoveCategories();
  const { mutate: updateCategory }  = useUpdateCategories()
  const [isEditOpen, setIsEditOpen] = React.useState(false);

  const { openConfirmation } = useConfirmation()

  const previewItems = items.slice(0, 3);
  const count = items.length;

  const toggleHideCategory = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateCategory({ id: categoryId, isHidden: !isHidden });
  };

  const handleEditCategory = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditOpen(true);
  };

  const handleDeleteCategory = (e: React.MouseEvent) => {
    e.stopPropagation();

    openConfirmation({
      title: 'Delete Category',
      content: 'Are you sure you want to delete this category?',
      onConfirm: () => {
        removeCategory(categoryId);
      }
    })
  }

  return (
    <div 
      onClick={() => onOpen(categoryId)}
      className={CARD_STYLES.base}
    >  
      <div className={CARD_STYLES.header}>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            {TitleIcon && <TitleIcon className="w-5 h-5 text-stone-400 group-hover:text-primary transition-colors" />}
            <h2 className={CARD_STYLES.title}>
              {categoryName}
            </h2>
            {isHidden && (
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                <EyeOff className="w-3 h-3 text-amber-500" />
                <span className="text-[9px] font-bold text-amber-500 uppercase tracking-tighter">Hidden</span>
              </div>
            )}
          </div>
        </div>
        
        {!hideMenu ? (
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500">
            <Menu as="div" className="relative">
              {({ open }) => (
                <>
                  <MenuButton 
                    onClick={(e) => e.stopPropagation()}
                    className={classNames(
                      "p-2 cursor-pointer rounded-xl transition-all duration-300",
                      open ? "bg-primary/10 text-primary" : "text-stone-500 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <MoreVertical className="w-4 h-4" />
                  </MenuButton>

                  <Transition
                    as={Fragment}
                    {...DROPDOWN_TRANSITION}
                  >
                    <MenuItems className={classNames(MENU_STYLES.items, "w-44 px-1.5")}>
                      <MenuItem>
                        {({ focus }) => (
                          <button
                            onClick={toggleHideCategory}
                            className={classNames(
                              focus ? MENU_STYLES.itemActive : MENU_STYLES.itemInactive,
                              MENU_STYLES.item
                            )}
                          >
                            {isHidden ? (
                              <>
                                <Eye className={classNames(MENU_STYLES.icon, focus ? MENU_STYLES.iconActive : MENU_STYLES.iconInactive)} />
                                <span>Unhide</span>
                              </>
                            ) : (
                              <>
                                <EyeOff className={classNames(MENU_STYLES.icon, focus ? MENU_STYLES.iconActive : MENU_STYLES.iconInactive)} />
                                <span>Hide</span>
                              </>
                            )}
                          </button>
                        )}
                      </MenuItem>
                      <MenuItem>
                        {({ focus }) => (
                          <button
                            onClick={handleEditCategory}
                            className={classNames(
                              focus ? MENU_STYLES.itemActive : MENU_STYLES.itemInactive,
                              MENU_STYLES.item
                            )}
                          >
                            <Pencil className={classNames(MENU_STYLES.icon, focus ? MENU_STYLES.iconActive : MENU_STYLES.iconInactive)} />
                            <span>Edit</span>
                          </button>
                        )}
                      </MenuItem>
                      <div className={MENU_STYLES.separator} />
                      <MenuItem>
                        {({ focus }) => (
                          <button
                            onClick={handleDeleteCategory}
                            className={classNames(
                              focus ? MENU_STYLES.itemDanger : MENU_STYLES.itemDangerInactive,
                              MENU_STYLES.item
                            )}
                          >
                            <Trash2 className={MENU_STYLES.icon} />
                            <span>Delete</span>
                          </button>
                        )}
                      </MenuItem>
                    </MenuItems>
                  </Transition>
                </>
              )}
            </Menu>
            <ChevronRight className="w-4 h-4 text-stone-500 group-hover:text-primary transition-colors" />
          </div>
        ) : (
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500">
            <ChevronRight className="w-4 h-4 text-stone-500 group-hover:text-primary transition-colors" />
          </div>
        )}
      </div>

      <div className="flex -space-x-5 items-center relative z-10">
        {previewItems.length > 0 ? (
          <>
            {previewItems.map((item, idx) => (
              <div 
                key={item.id} 
                className="relative w-24 h-32 rounded-2xl border border-white/5 overflow-hidden transition-all duration-500 group-hover:translate-y-[-4px]"
                style={{ 
                  zIndex: 10 - idx,
                  boxShadow: '0 4px 20px -8px rgba(0,0,0,0.5)'
                }}
              >
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.title || 'Preview'}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                ) : (
                  <div className="w-full h-full bg-[#18181b] flex items-center justify-center">
                    <Shirt className="w-5 h-5 text-stone-700" />
                  </div>
                )}
              </div>
            ))}
          </>
        ) : (
          <div className="w-full h-32 rounded-2xl bg-white/[0.01] border border-white/[0.03] flex items-center justify-center">
            <Shirt className="w-6 h-6 text-stone-800" />
          </div>
        )}
        
        {count > 3 && (
          <div 
            className="relative w-24 h-32 rounded-2xl border border-white/5 bg-[#18181b] flex items-center justify-center transition-all duration-500 group-hover:translate-y-[-4px] group-hover:border-primary/20" 
            style={{ zIndex: 0 }}
          >
            <span className="text-xs font-semibold text-primary/80 group-hover:text-primary transition-colors">
              +{count - 3}
            </span>
          </div>
        )}
      </div>
      
      {category && (
        <CategoryModal 
          isOpen={isEditOpen} 
          onClose={() => setIsEditOpen(false)} 
          category={category} 
        />
      )}
    </div>
  );
}

