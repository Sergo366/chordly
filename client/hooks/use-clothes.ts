import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { clothesApi, SaveClothingData } from '@/api/clothes';
import { salesApi } from '@/api/sales';

export const useAddClothing = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (file: File) => clothesApi.create(file),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clothes'] });
        },
    });
};

export const useSaveClothing = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: SaveClothingData) => clothesApi.save(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clothes'] });
        },
    });
};

export const useGetClothes = () => {
    return useQuery({
        queryKey: ['clothes'],
        queryFn: () => clothesApi.findAll(),
    });
};

export const useDeleteClothes = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => clothesApi.remove(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clothes'] });
        },
    });
};

export const useUpdateClothes = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: clothesApi.updateClothes,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clothes'] });
            queryClient.invalidateQueries({ queryKey: ['sales'] });
        },
    });
};

export const useGetSales = () => {
    return useQuery({
        queryKey: [],
        queryFn: () => salesApi.findSales(),
    });
};
