import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { http } from "@/lib/http";
import type { User, UpdateUserDto } from "@/schema/user";

export function useUser(id: string) {
  return useQuery({
    queryKey: ["users", id],
    queryFn: () => http<User>(`/user/${id}`),
    enabled: !!id,
  });
}

export function useUpdateUser(id: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserDto) =>
      http<User>(`/user/${id}`, { method: "PATCH", body: data }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      http(`/user/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
}
