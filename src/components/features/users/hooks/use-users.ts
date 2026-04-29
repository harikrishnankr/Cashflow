import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";

export function useUsers(page = 1, pageSize = 20) {
  return useQuery({
    queryKey: ["users", { page, pageSize }],
    queryFn: () => apiClient.users.list({ page, pageSize }),
  });
}
