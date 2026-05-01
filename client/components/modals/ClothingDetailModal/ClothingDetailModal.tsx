'use client';

import React, { useState } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild, Field, Input, Label, Select } from '@headlessui/react';
import { X, Edit2, Check, Shirt, ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import { CATEGORIES, SEASONS, TYPES, Category, Season } from '@/shared/clothes';
import { Clothing } from '@/api/clothes';
import { useUpdateClothes } from '@/hooks/use-clothes';
import { useToast } from '@/hooks/useToast';
import { Loader2 } from 'lucide-react';

interface ClothingDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: Clothing;
}

export function ClothingDetailModal({ isOpen, onClose, item }: ClothingDetailModalProps) {
  const { mutate: updateClothes, isPending } = useUpdateClothes();
  const { toast } = useToast();

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        userTitle: item.userTitle || item.title || '',
        category: (item.category as Category) || '',
        type: item.type || '',
        seasons: (item.seasons as Season[]) || [],
    });

    // Track previous props to detect changes for state synchronization
    const [prevId, setPrevId] = useState(item.id);
    const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

    // Sync state if item or isOpen changed (Standard React 18 pattern for resetting state from props)
    if (item.id !== prevId || isOpen !== prevIsOpen) {
        setPrevId(item.id);
        setPrevIsOpen(isOpen);
        setFormData({
            userTitle: item.userTitle || item.title || '',
            category: (item.category as Category) || '',
            type: item.type || '',
            seasons: (item.seasons as Season[]) || [],
        });
        setIsEditing(false);
    }

    const handleSave = async () => {
      updateClothes(
        { clothesId: item.id, data: { ...formData } },
        {
          onSuccess: () => {
            toast.success('Clothing updated successfully');
            handleClose();
          },
          onError: () => {
            toast.error('Failed to update clothing');
          },
        }
      );
    };

    const handleClose = () => {
        setIsEditing(false);
        onClose();
    };

    const toggleSeason = (season: Season) => {
        setFormData(prev => ({
            ...prev,
            seasons: prev.seasons.includes(season)
                ? prev.seasons.filter(s => s !== season)
                : [...prev.seasons, season]
        }));
    };

    return (
        <Transition show={isOpen} as={React.Fragment}>
            <Dialog as="div" className="relative z-[100]" onClose={handleClose}>
                <TransitionChild
                    as={React.Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-md" />
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
                            <DialogPanel className="w-full max-w-4xl transform overflow-hidden rounded-[2.5rem] bg-[#0A0A0C] border border-white/5 p-0 text-left align-middle shadow-2xl transition-all">
                                <div className="flex flex-col md:flex-row h-full max-h-[90vh]">
                                    {/* Left: Image Section */}
                                    <div className="w-full md:w-1/2 relative aspect-[4/5] md:aspect-auto bg-black/40 flex items-center justify-center group">
                                        {item.imageUrl ? (
                                            <Image
                                                src={item.imageUrl}
                                                alt={item.title || 'Clothing item'}
                                                fill
                                                className="object-contain p-8 transition-transform duration-700 group-hover:scale-105"
                                                priority
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center gap-4">
                                                <Shirt className="w-20 h-20 text-white/5" />
                                                <p className="text-white/20 font-medium">No image available</p>
                                            </div>
                                        )}
                                        
                                        {/* Back button (Mobile) */}
                                        <button 
                                            onClick={handleClose}
                                            disabled={isPending}
                                            className="md:hidden absolute top-6 left-6 p-3 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/10 disabled:opacity-50"
                                        >
                                            <ChevronLeft className="w-6 h-6" />
                                        </button>
                                    </div>

                                    {/* Right: Details Section */}
                                    <div className="w-full md:w-1/2 p-8 md:p-8 flex flex-col bg-zinc-950/50 backdrop-blur-xl border-l border-white/5">
                                        <div className="flex items-center justify-between mb-10">
                                            <DialogTitle as="h3" className="text-sm font-bold text-stone-500 uppercase tracking-[0.2em]">
                                                {isEditing ? 'Editing Item' : 'Item Details'}
                                            </DialogTitle>
                                            <button
                                                onClick={handleClose}
                                                disabled={isPending}
                                                className="hidden md:flex p-2 rounded-full hover:bg-white/5 transition-colors text-zinc-500 hover:text-white cursor-pointer disabled:opacity-50"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>

                                        <div className="flex-1 space-y-8 overflow-y-auto custom-scrollbar pr-2">
                                            {isEditing ? (
                                                <div className="space-y-6">
                                                    <Field className="px-1">
                                                        <Label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-2 ml-1">Item Title</Label>
                                                        <Input
                                                            type="text"
                                                            value={formData.userTitle}
                                                            onChange={(e) => setFormData(prev => ({ ...prev, userTitle: e.target.value }))}
                                                            disabled={isPending}
                                                            className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-stone-600 disabled:opacity-50"
                                                            placeholder="e.g. Vintage Denim Jacket"
                                                        />
                                                    </Field>

                                                    <Field className="px-1">
                                                        <Label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-2 ml-1">Category</Label>
                                                        <div className="relative">
                                                            <Select
                                                                value={formData.category}
                                                                onChange={(e) => {
                                                                    const newCategory = e.target.value as Category;
                                                                    setFormData(prev => ({ 
                                                                        ...prev, 
                                                                        category: newCategory,
                                                                        type: '' 
                                                                    }));
                                                                }}
                                                                disabled={isPending}
                                                                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none cursor-pointer disabled:opacity-50"
                                                            >
                                                                <option value="" disabled className="bg-zinc-900">Select category</option>
                                                                {CATEGORIES.map((category) => (
                                                                    <option key={category} value={category} className="bg-zinc-900">{category}</option>
                                                                ))}
                                                            </Select>
                                                        </div>
                                                    </Field>

                                                    <Field className="px-1">
                                                        <Label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-2 ml-1">Type</Label>
                                                        <div className="relative">
                                                            <Select
                                                                value={formData.type}
                                                                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                                                                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none cursor-pointer disabled:opacity-50"
                                                                disabled={!formData.category || isPending}
                                                            >
                                                                <option value="" disabled className="bg-zinc-900">Select type</option>
                                                                {formData.category && TYPES[formData.category as keyof typeof TYPES].map((type) => (
                                                                    <option key={type} value={type} className="bg-zinc-900">{type}</option>
                                                                ))}
                                                            </Select>
                                                        </div>
                                                    </Field>

                                                    <Field className="px-1">
                                                        <Label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-4 ml-1">Seasons</Label>
                                                        <div className="flex flex-wrap gap-2">
                                                            {SEASONS.map(season => (
                                                                <button
                                                                    key={season}
                                                                    onClick={() => toggleSeason(season)}
                                                                    disabled={isPending}
                                                                    className={`
                                                                        px-4 py-2 cursor-pointer rounded-full text-xs font-bold transition-all
                                                                        ${formData.seasons.includes(season)
                                                                            ? 'bg-primary text-background shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                                                                            : 'bg-white/5 text-stone-500 border border-white/5 hover:border-white/10 hover:text-white'}
                                                                        disabled:opacity-50
                                                                    `}
                                                                >
                                                                    {season}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </Field>
                                                </div>
                                            ) : (
                                                <div className="space-y-10">
                                                    <div>
                                                        <h4 className="text-4xl font-bold text-white tracking-tight leading-tight">
                                                            {item.userTitle || item.title || 'Untitled Item'}
                                                        </h4>
                                                        <div className="w-12 h-1 bg-gradient-to-r from-primary to-transparent rounded-full mt-4" />
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-y-8 gap-x-4">
                                                        <div>
                                                            <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5">Category</p>
                                                            <p className="text-lg text-stone-200 font-semibold">{item.category || 'Uncategorized'}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5">Type</p>
                                                            <p className="text-lg text-stone-200 font-semibold">{item.type || 'N/A'}</p>
                                                        </div>
                                                        <div className="col-span-2">
                                                            <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-3">Seasonal suitability</p>
                                                            <div className="flex flex-wrap gap-2">
                                                                {item.seasons && item.seasons.length > 0 ? (
                                                                    (item.seasons as string[]).map(season => (
                                                                        <span key={season} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-xs text-stone-400 font-medium">
                                                                            {season}
                                                                        </span>
                                                                    ))
                                                                ) : (
                                                                    <span className="text-xs text-stone-600 italic">No seasons specified</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-12 flex gap-4">
                                            {isEditing ? (
                                                <>
                                                    <button
                                                        onClick={() => setIsEditing(false)}
                                                        disabled={isPending}
                                                        className="flex-1 cursor-pointer px-8 py-4 rounded-2xl font-bold text-sm text-stone-400 hover:text-white bg-white/5 hover:bg-white/10 transition-all disabled:opacity-50"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        onClick={handleSave}
                                                        disabled={(!formData.userTitle && !formData.category) || isPending}
                                                        className="flex-[1.5] cursor-pointer flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-primary text-background font-bold text-sm hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-50"
                                                    >
                                                        {isPending ? (
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                        ) : (
                                                            <Check className="w-4 h-4 stroke-[3]" />
                                                        )}
                                                        {isPending ? 'Updating...' : 'Save Changes'}
                                                    </button>
                                                </>
                                            ) : (
                                                <button
                                                    onClick={() => setIsEditing(true)}
                                                    className="w-full flex cursor-pointer items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white text-black font-bold text-sm hover:bg-stone-200 transition-all active:scale-[0.98] shadow-xl"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                    Edit Details
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
