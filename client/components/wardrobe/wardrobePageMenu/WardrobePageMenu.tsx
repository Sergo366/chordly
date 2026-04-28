import React, { Fragment, useState } from 'react';
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import { classNames } from '@/lib/styles/classNames';
import { Eye, EyeOff, MoreVertical, Plus } from 'lucide-react';
import { DROPDOWN_TRANSITION, MENU_STYLES } from '@/lib/styles/header';
import { AddCategoryModal } from '@/components/modals/AddCategoryModal';

interface WardrobePageMenuProps {
  showHidden: boolean;
  onToggleShowHidden: () => void;
}

export const WardrobePageMenu = ({ showHidden, onToggleShowHidden }: WardrobePageMenuProps) => {
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);

  return (
    <>
      <div className="flex items-center gap-2 transition-all duration-500 mt-4">
        <Menu as="div" className="relative">
          {({ open }) => (
            <>
              <MenuButton
                onClick={(e) => e.stopPropagation()}
                className={classNames(
                  'p-2.5 cursor-pointer rounded-2xl transition-all duration-500 border-2 border-solid border-primary/30 backdrop-blur-md shadow-[0_0_15px_-5px_rgba(168,85,247,0.3)]',
                  open
                    ? 'bg-primary/20 text-white border-primary/60 shadow-[0_0_25px_-5px_rgba(168,85,247,0.5)] scale-105'
                    : 'text-primary/80 hover:text-white hover:bg-primary/20 hover:border-primary/50 hover:shadow-[0_0_20px_-5px_rgba(168,85,247,0.4)] hover:scale-105',
                )}
              >
                <MoreVertical className="w-5 h-5" />
              </MenuButton>

              <Transition as={Fragment} {...DROPDOWN_TRANSITION}>
                <MenuItems className={classNames(MENU_STYLES.items, 'w-44 px-1.5 z-10')}>
                  <MenuItem>
                    {({ focus }) => (
                      <button
                        onClick={onToggleShowHidden}
                        className={classNames(
                          focus ? MENU_STYLES.itemActive : MENU_STYLES.itemInactive,
                          MENU_STYLES.item,
                        )}
                      >
                        {showHidden ? (
                          <Eye
                            className={classNames(
                              MENU_STYLES.icon,
                              focus ? MENU_STYLES.iconActive : MENU_STYLES.iconInactive,
                            )}
                          />
                        ) : (
                          <EyeOff
                            className={classNames(
                              MENU_STYLES.icon,
                              focus ? MENU_STYLES.iconActive : MENU_STYLES.iconInactive,
                            )}
                          />
                        )}
                        <span>{showHidden ? 'Hide hidden' : 'Show hidden'}</span>
                      </button>
                    )}
                  </MenuItem>
                  <MenuItem>
                    {({ focus }) => (
                      <button
                        onClick={() => setIsAddCategoryOpen(true)}
                        className={classNames(
                          focus ? MENU_STYLES.itemActive : MENU_STYLES.itemInactive,
                          MENU_STYLES.item,
                        )}
                      >
                        <Plus
                          className={classNames(
                            'w-3.5 h-3.5',
                            MENU_STYLES.icon,
                            focus ? MENU_STYLES.iconActive : MENU_STYLES.iconInactive,
                          )}
                        />
                        <span>Add category</span>
                      </button>
                    )}
                  </MenuItem>
                </MenuItems>
              </Transition>
            </>
          )}
        </Menu>
      </div>

      <AddCategoryModal
        isOpen={isAddCategoryOpen}
        onClose={() => setIsAddCategoryOpen(false)}
      />
    </>
  );
};