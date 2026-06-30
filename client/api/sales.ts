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

export const salesApi = {
  /** Get all clothing items for sale */
  findSales: async (): Promise<Clothing[]> => {
    const response = await apiClient.get<Clothing[]>('/sales');
    return response.data;
  },
};
