import React, { useState, useEffect, useMemo } from 'react';
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
  Field,
  Input,
  Label,
  Select,
  Textarea,
  Checkbox,
} from '@headlessui/react';
import { X, Loader2, Check } from 'lucide-react';
import { useUpdateClothes } from '@/hooks/useUpdateClothes/useUpdateClothes';
import { Clothing, SaleData } from '@/api/clothes';
import { useToast } from '@/hooks/useToast';

interface SellClothingModalProps {
  isOpen: boolean;
  onClose: () => void;
  clothing: Clothing | null;
}

const initialSaleState: SaleData = {
  title: '',
  price: 0,
  currency: 'USD',
  description: '',
  isNegotiable: false,
};

export function SellClothingModal({ isOpen, onClose, clothing }: SellClothingModalProps) {
  const [formData, setFormData] = useState<SaleData>(initialSaleState);
  const [isForSale, setIsForSale] = useState(false);
  const { mutate: updateClothes, isPending } = useUpdateClothes();
  const { toast } = useToast();

  const initialFormData = useMemo(() => {
    if (!clothing || !isOpen) return initialSaleState;
    
    if (clothing.sale) {
      return {
        title: clothing.sale.title || clothing.title || '',
        price: clothing.sale.price || 0,
        currency: clothing.sale.currency || 'USD',
        description: clothing.sale.description || '',
        isNegotiable: clothing.sale.isNegotiable || false,
      };
    } else {
      return {
        ...initialSaleState,
        title: clothing.title || '',
      };
    }
  }, [clothing, isOpen]);

  useEffect(() => {
    if (clothing && isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsForSale(!clothing.isForSale);
      setFormData(initialFormData);
    } else if (!isOpen) {
      setFormData(initialSaleState);
      setIsForSale(false);
    }
  }, [initialFormData, isOpen, clothing]);

  const resetAndClose = () => {
    toast.success(isForSale ? 'Removed from sales' : 'Marked for sales')
    setFormData(initialSaleState);
    onClose();
  };

  const handleSubmit = () => {
    if (!clothing) return;
    updateClothes({
        clothesId: clothing.id,
        data: {
          isForSale: isForSale,
          sale: isForSale ? {
            title: formData.title.trim(),
            price: Number(formData.price),
            currency: formData.currency,
            description: formData.description?.trim() || null,
            isNegotiable: formData.isNegotiable,
          } : null,
        },
      },
      {
        onSuccess: () => {
          resetAndClose();
        },
      }
    );
  };

  const isValid = isForSale ? (formData.title.trim().length > 0 && formData.price > 0) : true;

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
              <DialogPanel className="w-full max-w-md transform rounded-3xl bg-zinc-950 border border-zinc-800 p-8 text-left align-middle shadow-2xl transition-all">
                <div className="flex items-center justify-between mb-6">
                  <DialogTitle as="h3" className="text-2xl font-light text-white">
                    Sell Item
                  </DialogTitle>
                  <button
                    onClick={resetAndClose}
                    disabled={isPending}
                    className="p-2 rounded-full cursor-pointer hover:bg-white/5 transition-colors text-zinc-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Status Toggle */}
                  <div className="flex items-center justify-between bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
                    <div>
                      <h4 className="text-white font-medium text-sm mb-1">List for Sale</h4>
                      <p className="text-xs text-zinc-500">Make this item visible on the marketplace</p>
                    </div>
                    <Checkbox
                      checked={isForSale}
                      onChange={setIsForSale}
                      className="group block size-6 rounded-md bg-zinc-800 data-[checked]:bg-primary transition-colors cursor-pointer ring-1 ring-inset ring-zinc-700 data-[checked]:ring-primary"
                    >
                      <Check className="opacity-0 group-data-[checked]:opacity-100 text-background w-full h-full p-1" />
                    </Checkbox>
                  </div>

                  {isForSale && (
                    <div className="space-y-5 animate-in fade-in slide-in-from-top-4 duration-300">
                      {/* Title */}
                      <Field>
                        <Label className="block text-sm font-medium text-zinc-400 mb-2">
                          Listing Title <span className="text-primary">*</span>
                        </Label>
                        <Input
                          type="text"
                          value={formData.title}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, title: e.target.value }))
                          }
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-zinc-600"
                          placeholder="e.g. Vintage Nike Hoodie"
                          disabled={isPending}
                        />
                      </Field>

                      {/* Price and Currency */}
                      <div className="flex gap-4">
                        <Field className="flex-1">
                          <Label className="block text-sm font-medium text-zinc-400 mb-2">
                            Price <span className="text-primary">*</span>
                          </Label>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={formData.price || ''}
                            onChange={(e) =>
                              setFormData((prev) => ({ ...prev, price: parseFloat(e.target.value) || 0 }))
                            }
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-zinc-600 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            placeholder="0.00"
                            disabled={isPending}
                          />
                        </Field>

                        <Field className="w-1/3">
                          <Label className="block text-sm font-medium text-zinc-400 mb-2">
                            Currency
                          </Label>
                          <Select
                            value={formData.currency}
                            onChange={(e) =>
                              setFormData((prev) => ({ ...prev, currency: e.target.value as typeof formData.currency  }))
                            }
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none"
                            disabled={isPending}
                          >
                            <option value="USD">USD ($)</option>
                            <option value="EUR">EUR (€)</option>
                            <option value="UAH">UAH (₴)</option>
                          </Select>
                        </Field>
                      </div>

                      {/* Description */}
                      <Field>
                        <Label className="block text-sm font-medium text-zinc-400 mb-2">
                          Description
                        </Label>
                        <Textarea
                          value={formData.description ?? ''}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, description: e.target.value }))
                          }
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-zinc-600 min-h-[100px] resize-none"
                          placeholder="Describe the condition, size, or any flaws..."
                          disabled={isPending}
                        />
                      </Field>

                      {/* Negotiable */}
                      <Field className="flex items-center gap-3 bg-zinc-900/50 p-3 rounded-xl border border-zinc-800/50">
                        <Checkbox
                          checked={formData.isNegotiable}
                          onChange={(checked) =>
                            setFormData((prev) => ({ ...prev, isNegotiable: checked }))
                          }
                          className="group block size-5 rounded-md bg-zinc-800 data-[checked]:bg-primary transition-colors cursor-pointer ring-1 ring-inset ring-zinc-700 data-[checked]:ring-primary"
                        >
                          <Check className="opacity-0 group-data-[checked]:opacity-100 text-background w-full h-full p-0.5" />
                        </Checkbox>
                        <Label className="text-sm font-medium text-zinc-400 cursor-pointer">
                          Price is negotiable
                        </Label>
                      </Field>
                    </div>
                  )}
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
                    {isPending ? 'Saving...' : 'Save Listing'}
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
