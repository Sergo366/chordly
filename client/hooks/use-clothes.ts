import { useMutation, useQuery, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
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

export const useGetSalesInfinite = () => {
    return useInfiniteQuery({
        queryKey: ['sales-infinite'],
        queryFn: ({ pageParam = 1 }) => salesApi.findSales(pageParam, 10),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            return lastPage.meta.hasMore ? lastPage.meta.page + 1 : undefined;
        },
    });
};
