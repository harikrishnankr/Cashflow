import { useQuery } from "@tanstack/react-query";
import { http } from "@/lib/http";
import type { PaginatedResponse } from "@/schema/common";
import type { User } from "@/schema/user";

export function useUsers(page = 1, pageSize = 20) {
  return useQuery({
    queryKey: ["users", { page, pageSize }],
    queryFn: () =>
      http<PaginatedResponse<User>["data"]>(
        `/users?page=${page}&pageSize=${pageSize}`
      ),
  });
}
