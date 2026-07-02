import apiClient from '@/lib/api-client';
import { Clothing } from './clothes';

export type SaleCurrency = 'EUR' | 'USD' | 'UAH';

export interface SaleData {
  title: string;
  price: number;
  currency: SaleCurrency;
  description?: string | null;
  isNegotiable: boolean;
}

export interface SalesResponse {
  data: Clothing[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export const salesApi = {
  /** Get all clothing items for sale with pagination */
  findSales: async (
    page: number = 1,
    limit: number = 10,
    searchQuery: string = '',
    sortBy: string = 'none'
  ): Promise<SalesResponse> => {
    const response = await apiClient.get<SalesResponse>('/sales', {
      params: { page, limit, search: searchQuery, sort: sortBy },
    });
    return response.data;
  },
};
