import apiClient from '@/lib/api-client';

export type Category = {
  id: string;
  name: string;
  iconName: string;
  isHidden: boolean;
  categoryTypes: { id: string; name: string }[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export const getCategories = async () => {
  try {
    const response = await apiClient.get<Category[]>('/categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
}

export const removeUserCategory = async (categoryId: string) => {
  try {
    const response = await apiClient.delete<Category[]>('/categories', {
      data: { categoryId },
    });
    return response.data;
  } catch (error) {
    console.error('Error removing category:', error);
  }
}

export const updateUserCategory = async (categoryParams: Partial<Category> & { id: string }) => {
  try {
    const response = await apiClient.patch<Category[]>('/categories/update-category', categoryParams);
    return response.data;
  } catch (error) {
    console.error('Error updating category:', error);
  }
}

export type CreateCategoryParams = {
  name: string;
  iconName?: string;
  categoryTypes?: { id: string; name: string }[];
};

export const createUserCategory = async (params: CreateCategoryParams) => {
  try {
    const response = await apiClient.post<Category[]>('/categories', params);
    return response.data;
  } catch (error) {
    console.error('Error creating category:', error);
  }
}