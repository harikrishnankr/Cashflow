import type { ApiResponse } from "@/types/api.types";
import type { UpdateUserDto } from "@/types/user.types";

class ApiError extends Error {
  constructor(public code: string, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(
  path: string,
  init: RequestInit = {}
): Promise<ApiResponse<T>> {
  const res = await fetch(`/api${path}`, {
    headers: { "Content-Type": "application/json", ...init.headers },
    ...init,
  });

  const json: ApiResponse<T> = await res.json();
  return json;
}

export const apiClient = {
  auth: {
    login: (body: { email: string; password: string; rememberMe?: boolean }) =>
      request("/auth/login", { method: "POST", body: JSON.stringify(body) }),

    register: (body: { email: string; password: string; name: string }) =>
      request("/auth/register", { method: "POST", body: JSON.stringify(body) }),

    logout: () =>
      request("/auth/logout", { method: "POST" }),
  },

  users: {
    list: (params?: { page?: number; pageSize?: number }) => {
      const qs = params ? `?${new URLSearchParams(params as Record<string, string>)}` : "";
      return request(`/users${qs}`);
    },

    getById: (id: string) =>
      request(`/users/${id}`),

    update: (id: string, body: UpdateUserDto) =>
      request(`/users/${id}`, { method: "PATCH", body: JSON.stringify(body) }),

    delete: (id: string) =>
      request(`/users/${id}`, { method: "DELETE" }),
  },
};

export { ApiError };
