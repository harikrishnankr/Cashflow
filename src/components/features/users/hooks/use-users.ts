import { useQuery } from "@tanstack/react-query";
import { http } from "@/lib/http";
import type { PaginatedResponse } from "@/schema/common";
import type { User } from "@/schema/user";
import { useAuthStore } from "../../auth";

export function useUsers(page = 1, pageSize = 20) {
  const token = useAuthStore((s) => s.session?.accessToken);

  return useQuery({
    queryKey: ["users", { page, pageSize }],
    queryFn: () =>
      http<PaginatedResponse<User>["data"]>(
        `/users?page=${page}&pageSize=${pageSize}`,
        { token },
      ),
  });
}
