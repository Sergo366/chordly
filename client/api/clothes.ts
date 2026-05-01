import apiClient from '@/lib/api-client';
import { Category, Season } from '@/shared/clothes';

export interface SerperImageResult {
    title: string;
    imageUrl: string;
    imageWidth: number;
    imageHeight: number;
    thumbnailUrl: string;
    thumbnailWidth: number;
    thumbnailHeight: number;
    source: string;
    domain: string;
    link: string;
    googleUrl: string;
    position: number;
}

export interface SaveClothingData {
    imageUrl: string;
    title: string;
    userTitle: string;
    category: Category | "";
    type: string;
    seasons: Season[];
    ticker?: string;
    isFavorite?: boolean;
    isHidden?: boolean;
    isForSale?: boolean;
}

export interface Clothing {
    id: string;
    name?: string;
    title?: string;
    type?: string;
    category?: string;
    seasons?: string[];
    color?: string;
    size?: string;
    brand?: string;
    imageUrl?: string;
    ticker?: string;
    userTitle?: string;
    isFavorite?: boolean;
    isHidden?: boolean;
    isForSale?: boolean;
    searchResults?: SerperImageResult[];
}

export const clothesApi = {
    create: async (file: File): Promise<Clothing> => {
      const formData = new FormData();
      formData.append('image', file);

      const response = await apiClient.post<Clothing>('/clothes/get-clothes-from-image', formData, {
            headers: {'Content-Type': 'multipart/form-data'},
        });
        return response.data;
    },

    findAll: async (): Promise<Clothing[]> => {
        const response = await apiClient.get<Clothing[]>('/clothes');
        return response.data;
    },

    save: async (data: SaveClothingData): Promise<Clothing> => {
        const response = await apiClient.post<Clothing>('/clothes/save-clothes', data);
        return response.data;
    },

   updateClothes: async ({ data, clothesId }: { data: Partial<SaveClothingData>, clothesId: string }): Promise<void> => {
        await apiClient.patch(`/clothes/${clothesId}`, data);
    },

    remove: async (id: string): Promise<void> => {
        await apiClient.delete(`/clothes/${id}`);
    },
};
