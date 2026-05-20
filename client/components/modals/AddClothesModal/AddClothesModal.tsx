'use client';

import React, { useMemo, useState } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild, Field, Input, Label, Select } from '@headlessui/react';
import { X, Check, Loader2 } from 'lucide-react';
import { SerperImageResult } from '@/api/clothes';
import Image from 'next/image';
import { SEASONS, Category, Season } from '@/shared/clothes';
import { useSaveClothing } from '@/hooks/use-clothes';
import { defaultFormValues } from './const';
import { useToast } from '@/hooks/useToast';
import { useCategories } from '@/hooks/useCategories';

interface AddClothesModalProps {
    isOpen: boolean;
    onClose: () => void;
    searchResults: SerperImageResult[];
    ticker?: string;
    initialCategory?: Category;
}

export function AddClothesModal({ isOpen, onClose, searchResults, ticker, initialCategory }: AddClothesModalProps) {
    const { toast } = useToast();
    const { data: categoriesData } = useCategories()

    const [step, setStep] = useState<'selection' | 'details'>('selection');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        ...defaultFormValues,
        category: initialCategory || defaultFormValues.category
    });
    const { mutate: saveClothing, isPending: isSaving } = useSaveClothing();

    // Recommended React pattern to update state on prop change without useEffect
    const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
    if (isOpen !== prevIsOpen) {
        setPrevIsOpen(isOpen);
        if (isOpen) {
            setFormData(prev => ({ ...prev, category: initialCategory || defaultFormValues.category }));
        }
    }

    const categoryTypes = useMemo(() => {
      if (!formData.category || !categoriesData) {
        return [];
      }

      return categoriesData.find((category) => category.name === formData.category)?.categoryTypes ?? []

    }, [formData.category, categoriesData])

    const handleConfirm = () => {
        if (selectedImage) {
            saveClothing({
                imageUrl: selectedImage,
                ...formData,
                ticker,
            }, 
            {
                onSuccess: () => {
                  toast.success('Clothes added successfully!');
                  resetAndClose();
                }
            });
        }
    };

    const handleSelectImage = (image: string, title: string) => {
        setSelectedImage(image);
        setFormData(prev => ({ ...prev, title }));
    };

    const toggleSeason = (season: Season) => {
        setFormData(prev => ({
            ...prev,
            seasons: prev.seasons.includes(season)
                ? prev.seasons.filter(s => s !== season)
                : [...prev.seasons, season]
        }));
    };

    const resetAndClose = () => {
        setStep('selection');
        setSelectedImage(null);
        setFormData(defaultFormValues);
        onClose();
    };

    return (
        <Transition show={isOpen} as={React.Fragment}>
            <Dialog as="div" className="relative z-[100]" onClose={resetAndClose}>
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
                            <DialogPanel className="w-full max-w-4xl transform overflow-hidden rounded-3xl bg-zinc-950 border border-zinc-800 p-8 text-left align-middle shadow-2xl transition-all">
                                <div className="flex items-center justify-between mb-6">
                                    <DialogTitle as="h3" className="text-2xl font-light text-white">
                                        {step === 'selection' ? 'Select the best photo' : 'Confirm details'}
                                    </DialogTitle>
                                    <button
                                        onClick={resetAndClose}
                                        disabled={isSaving}
                                        className="p-2 rounded-full cursor-pointer hover:bg-white/5 transition-colors text-zinc-400 hover:text-white"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                {step === 'selection' ? (
                                    <>
                                        {ticker && (
                                            <div className="mb-6 p-3 rounded-xl bg-violet-500/10 border border-violet-500/20 w-fit">
                                                <p className="text-xs text-violet-300 uppercase tracking-widest font-medium mb-1">Detected Ticker</p>
                                                <p className="text-lg font-mono text-white">{ticker}</p>
                                            </div>
                                        )}

                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                                            {searchResults?.map((img, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => handleSelectImage(img.imageUrl, img.title)}
                                                    className={`
                                                        relative aspect-square cursor-pointer rounded-2xl overflow-hidden border-2 transition-all duration-300 group
                                                        ${selectedImage === img.imageUrl 
                                                            ? 'border-primary ring-4 ring-primary/20 scale-[0.98]' 
                                                            : 'border-zinc-800 hover:border-zinc-700'}
                                                    `}
                                                >
                                                    <Image
                                                        src={img.thumbnailUrl}
                                                        alt={img.title}
                                                        fill
                                                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                    />
                                                    {selectedImage === img.imageUrl && (
                                                        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center backdrop-blur-[2px]">
                                                            <div className="w-10 h-10 rounded-full bg-primary text-background flex items-center justify-center shadow-lg transform animate-in zoom-in duration-300">
                                                                <Check className="w-6 h-6 stroke-[3]" />
                                                            </div>
                                                        </div>
                                                    )}
                                                </button>
                                            ))}
                                        </div>

                                        <div className="mt-8 flex justify-end gap-3">
                                            <button
                                                onClick={resetAndClose}
                                                className="px-6 py-3 cursor-pointer rounded-xl font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={() => setStep('details')}
                                                disabled={!selectedImage}
                                                className={`
                                                    px-8 py-3 rounded-xl font-semibold transition-all duration-300
                                                    ${!selectedImage 
                                                        ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                                                        : 'bg-primary text-background hover:bg-primary-hover shadow-lg shadow-primary/20 active:scale-95'}
                                                `}
                                            >
                                                Next step
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="relative aspect-square rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 flex items-center justify-center">
                                            {selectedImage && (
                                                <Image
                                                    src={selectedImage}
                                                    alt="Selected"
                                                    fill
                                                    className="object-contain p-4"
                                                    unoptimized
                                                />
                                            )}
                                        </div>

                                        <div className="space-y-6">
                                            <div>
                                                {ticker && <p className="text-lg font-mono text-white">{ticker}</p>}
                                                {formData.title && <p className="text-lg font-mono text-white">{formData.title}</p>}
                                            </div>  
                                            <Field>
                                                <Label className="block text-sm font-medium text-zinc-400 mb-2">Item Name</Label>
                                                <Input
                                                    type="text"
                                                    value={formData.userTitle}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, userTitle: e.target.value }))}
                                                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                                    placeholder="Enter name..."
                                                />
                                            </Field>

                                            <Field>
                                                <Label className="block text-sm font-medium text-zinc-400 mb-2">Category</Label>
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
                                                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none"
                                                    >
                                                        <option value="" disabled>Select category</option>
                                                        {categoriesData?.map((category) => (
                                                            <option key={category.id} value={category.name}>{category.name}</option>
                                                        ))}
                                                    </Select>
                                                </div>
                                            </Field>

                                            <Field>
                                                <Label className="block text-sm font-medium text-zinc-400 mb-2">Type</Label>
                                                <div className="relative">
                                                    <Select
                                                        value={formData.type}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                                                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none"
                                                        disabled={!formData.category}
                                                    >
                                                        <option value="" disabled>Select type</option>
                                                        {categoryTypes?.map((type) => (
                                                            <option key={type.id} value={type.name}>{type.name}</option>
                                                        ))}
                                                    </Select>
                                                </div>
                                            </Field>

                                            <Field>
                                                <Label className="block text-sm font-medium text-zinc-400 mb-2">Season</Label>
                                                <div className="flex flex-wrap gap-2">
                                                    {SEASONS.map(season => (
                                                        <button
                                                            key={season}
                                                            onClick={() => toggleSeason(season)}
                                                            className={`
                                                                px-4 py-2 rounded-full text-sm font-medium transition-all
                                                                ${formData.seasons.includes(season)
                                                                    ? 'bg-primary text-background'
                                                                    : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-700'}
                                                            `}
                                                        >
                                                            {season}
                                                        </button>
                                                    ))}
                                                </div>
                                            </Field>

                                            <div className="pt-4 flex gap-3">
                                                <button
                                                    onClick={() => setStep('selection')}
                                                    disabled={isSaving}
                                                    className="flex-1 px-6 py-3 rounded-xl font-medium text-white border border-zinc-800 hover:bg-white/5 transition-all cursor-pointer"
                                                >
                                                    Back
                                                </button>
                                                <button
                                                    onClick={handleConfirm}
                                                    disabled={!formData.title || !formData.category || formData.seasons.length === 0 || isSaving}
                                                    className={`
                                                        flex-[2] px-8 py-3 cursor-pointer rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2
                                                        ${(!formData.title || !formData.category || formData.seasons.length === 0 || isSaving)
                                                            ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                                                            : 'bg-primary text-background hover:bg-primary-hover shadow-lg shadow-primary/20 active:scale-95'}
                                                    `}
                                                >
                                                    {isSaving && <Loader2 className="w-5 h-5 animate-spin" />}
                                                    {isSaving ? 'Saving...' : 'Confirm'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}