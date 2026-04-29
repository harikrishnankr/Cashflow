import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import type { UpdateUserDto } from "@/types/user.types";

export function useUser(id: string) {
  return useQuery({
    queryKey: ["users", id],
    queryFn: () => apiClient.users.getById(id),
    enabled: !!id,
  });
}

export function useUpdateUser(id: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserDto) => apiClient.users.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.users.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
