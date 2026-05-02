import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { http } from "@/lib/http";
import type { User, UpdateUserDto } from "@/schema/user";
import { useAuthStore } from "../../auth";

export function useUser(id: string) {
  const token = useAuthStore((s) => s.session?.accessToken);

  return useQuery({
    queryKey: ["users", id],
    queryFn: () => http<User>(`/users/${id}`, { token }),
    enabled: !!id,
  });
}

export function useUpdateUser(id: string) {
  const qc = useQueryClient();
  const token = useAuthStore((s) => s.session?.accessToken);

  return useMutation({
    mutationFn: (data: UpdateUserDto) =>
      http<User>(`/users/${id}`, { method: "PATCH", body: data, token }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  const token = useAuthStore((s) => s.session?.accessToken);

  return useMutation({
    mutationFn: (id: string) =>
      http(`/users/${id}`, { method: "DELETE", token }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
}
