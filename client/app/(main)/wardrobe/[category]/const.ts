
export const SPECIAL_SECTION_CONFIG: Record<
  string,
  {
    label: string;
    description: string;
    EmptyMessage: string;
    iconName: string;
    iconClass: string;
    filter: (item: { isFavorite?: boolean; isHidden?: boolean; isForSale?: boolean }) => boolean;
  }
> = {
  'favorites': {
    label: 'Favorites',
    description: 'Items you have marked as your favorites.',
    EmptyMessage: 'No favorite items yet. Mark items using the card menu.',
    iconName: 'Heart',
    iconClass: 'text-primary fill-primary',
    filter: (item) => !!item.isFavorite,
  },
  'hidden': {
    label: 'Hidden',
    description: 'Items you have hidden from your main wardrobe view.',
    EmptyMessage: 'No hidden items. Use the card menu to hide items.',
    iconName: 'EyeOff',
    iconClass: 'text-stone-400',
    filter: (item) => !!item.isHidden,
  },
  'for-sale': {
    label: 'For Sale',
    description: 'Items you are looking to sell.',
    EmptyMessage: 'No items listed for sales. Use the card menu to mark items for sales.',
    iconName: 'DollarSign',
    iconClass: 'text-green-400',
    filter: (item) => !!item.isForSale,
  },
};
