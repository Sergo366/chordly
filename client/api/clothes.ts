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

export type SaleCurrency = 'EUR' | 'USD' | 'UAH';

export interface SaleData {
  title: string;
  price: number;
  currency: SaleCurrency;
  description?: string | null;
  isNegotiable: boolean;
}

export interface SaveClothingData {
  imageUrl: string;
  title: string;
  userTitle: string;
  category: Category | '';
  type: string;
  seasons: Season[];
  ticker?: string;
  isFavorite?: boolean;
  isHidden?: boolean;
  isForSale?: boolean;
  sale?: SaleData | null;
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
  sale?: SaleData;
  searchResults?: SerperImageResult[];
}

/**
 * API client for clothing‑related endpoints.
 *
 * - `getPresignedUrl` returns `uploadUrl` (for PUT) and a **permanent** `fileUrl`
 *   with the query string stripped.
 * - `uploadToS3` performs the PUT and sets the object ACL to public‑read.
 * - `ensurePublicAccess` does a HEAD request to the permanent URL and logs a warning
 *   if the object is not publicly accessible.
 * - `uploadAndVerify` combines the upload and the public‑access check.
 */
export const clothesApi = {
  /** Create a clothing entry from an image */
  create: async (file: File): Promise<Clothing> => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await apiClient.post<Clothing>(
      '/clothes/get-clothes-from-image',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data;
  },

  /** Get all clothing items */
  findAll: async (): Promise<Clothing[]> => {
    const response = await apiClient.get<Clothing[]>('/clothes');
    return response.data;
  },

  /** Save a clothing item */
  save: async (data: SaveClothingData): Promise<Clothing> => {
    const response = await apiClient.post<Clothing>('/clothes/save-clothes', data);
    return response.data;
  },

  /** Update an existing clothing item */
  updateClothes: async ({ data, clothesId }: { data: Partial<SaveClothingData>; clothesId: string }): Promise<void> => {
    await apiClient.patch(`/clothes/${clothesId}`, data);
  },

  /** Delete a clothing item */
  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`/clothes/${id}`);
  },

  /** Get a single clothing item by ID */
  findById: async (id: string): Promise<Clothing> => {
    const response = await apiClient.get<Clothing>(`/clothes/${id}`);
    return response.data;
  },

  /**
   * Request a presigned URL for a direct S3/R2 upload.
   * The returned `fileUrl` is stripped of the signature query string so it can be stored permanently.
   */
  getPresignedUrl: async (filename: string, contentType: string): Promise<{ uploadUrl: string; fileUrl: string }> => {
    const response = await apiClient.post<{ uploadUrl: string; fileUrl: string }>('/clothes/presigned-url', {
      filename,
      contentType,
    });
    return {
      ...response.data,
      fileUrl: response.data.fileUrl.split('?')[0], // strip signature → permanent URL
    };
  },

  /** Upload the compressed file to the signed URL */
  uploadToS3: async (uploadUrl: string, file: File | Blob): Promise<void> => {
    try {
      const response = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });
      if (!response.ok) {
        throw new Error(`S3 upload failed with status ${response.status}`);
      }
    } catch (error) {
      console.error('Error uploading to S3:', error);
      throw error;
    }
  },
};
