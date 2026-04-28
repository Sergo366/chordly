import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createUserCategory } from '@/api/categories';
import { useToast } from '@/hooks/useToast';

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: createUserCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category created successfully');
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'Failed to create category');
    },
  });
};
