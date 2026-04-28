'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
  Field,
  Input,
  Label,
} from '@headlessui/react';
import { X, Plus, Trash2, Loader2 } from 'lucide-react';
import { IconPicker } from '@/components/ui/IconPicker';
import { useCreateCategory } from '@/hooks/useCategories/useCreateCategory';
import { randomUUID } from '@/lib/utils/uuid';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CategoryTypeItem {
  id: string;
  name: string;
}

const initialFormState = {
  name: '',
  iconName: '',
};

export function AddCategoryModal({ isOpen, onClose }: AddCategoryModalProps) {
  const [formData, setFormData] = useState(initialFormState);
  const [categoryTypes, setCategoryTypes] = useState<CategoryTypeItem[]>([]);
  const [newTypeName, setNewTypeName] = useState('');
  const { mutate: createCategory, isPending } = useCreateCategory();

  const resetAndClose = () => {
    setFormData(initialFormState);
    setCategoryTypes([]);
    setNewTypeName('');
    onClose();
  };

  const handleAddType = () => {
    const trimmed = newTypeName.trim();
    if (!trimmed) return;

    setCategoryTypes((prev) => [
      ...prev,
      { id: randomUUID(), name: trimmed },
    ]);
    setNewTypeName('');
  };

  const handleRemoveType = (id: string) => {
    setCategoryTypes((prev) => prev.filter((t) => t.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddType();
    }
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) return;

    createCategory(
      {
        name: formData.name.trim(),
        iconName: formData.iconName || undefined,
        categoryTypes: categoryTypes.length > 0 ? categoryTypes : undefined,
      },
      {
        onSuccess: () => {
          resetAndClose();
        },
      },
    );
  };

  const isValid = formData.name.trim().length > 0;

  return (
    <Transition show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-[110]" onClose={resetAndClose}>
        <TransitionChild
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95 translate-y-4"
              enterTo="opacity-100 scale-100 translate-y-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100 translate-y-0"
              leaveTo="opacity-0 scale-95 translate-y-4"
            >
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-3xl bg-zinc-950 border border-zinc-800 p-8 text-left align-middle shadow-2xl transition-all">
                <div className="flex items-center justify-between mb-6">
                  <DialogTitle as="h3" className="text-2xl font-light text-white">
                    New Category
                  </DialogTitle>
                  <button
                    onClick={resetAndClose}
                    disabled={isPending}
                    className="p-2 rounded-full cursor-pointer hover:bg-white/5 transition-colors text-zinc-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-5">
                  {/* Category Name */}
                  <Field>
                    <Label className="block text-sm font-medium text-zinc-400 mb-2">
                      Category Name <span className="text-primary">*</span>
                    </Label>
                    <Input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, name: e.target.value }))
                      }
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-zinc-600"
                      placeholder="e.g. Outerwear, Accessories..."
                      disabled={isPending}
                    />
                  </Field>

                  {/* Icon */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">
                      Icon
                    </label>
                    <IconPicker
                      value={formData.iconName}
                      onChange={(iconName) =>
                        setFormData((prev) => ({ ...prev, iconName }))
                      }
                      disabled={isPending}
                    />
                  </div>

                  {/* Category Types */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">
                      Category Types
                    </label>

                    {/* Type list */}
                    {categoryTypes.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {categoryTypes.map((type) => (
                          <div
                            key={type.id}
                            className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary transition-all"
                          >
                            <span>{type.name}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveType(type.id)}
                              disabled={isPending}
                              className="p-0.5 rounded-full cursor-pointer opacity-50 hover:opacity-100 hover:bg-primary/20 transition-all"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add type input */}
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        value={newTypeName}
                        onChange={(e) => setNewTypeName(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-zinc-600"
                        placeholder="Type name..."
                        disabled={isPending}
                      />
                      <button
                        type="button"
                        onClick={handleAddType}
                        disabled={!newTypeName.trim() || isPending}
                        className={`
                          px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 flex items-center justify-center
                          ${
                            !newTypeName.trim()
                              ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                              : 'bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 active:scale-95'
                          }
                        `}
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-8 flex justify-end gap-3">
                  <button
                    onClick={resetAndClose}
                    disabled={isPending}
                    className="px-6 py-2.5 cursor-pointer rounded-xl font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-all text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!isValid || isPending}
                    className={`
                      px-6 py-2.5 cursor-pointer rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 text-sm
                      ${
                        !isValid || isPending
                          ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                          : 'bg-primary text-background hover:bg-primary-hover shadow-lg shadow-primary/20 active:scale-95'
                      }
                    `}
                  >
                    {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                    {isPending ? 'Creating...' : 'Create'}
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
