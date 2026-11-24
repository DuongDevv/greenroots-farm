import createClient, { type Middleware } from "openapi-fetch";
import { useAuthStore } from "@/stores/auth.store";
import type { paths } from "@/types/api-schema";

let isRefreshing = false;

const bearerMiddleware: Middleware = {
  onRequest({ request }) {
    const token = useAuthStore.getState().accessToken;
    if (token && !request.headers.has("Authorization")) {
      request.headers.set("Authorization", `Bearer ${token}`);
    }
    return request;
  },

  async onResponse({ response, request }) {
    if (response.status === 401) {
      const url = request.url;

      // Nếu chính request đăng nhập hoặc refresh bị 401 thì dừng ngay, cấm gọi đệ quy!
      if (url.includes("/auth/login") || url.includes("/auth/refresh")) {
        return response;
      }

      const auth = useAuthStore.getState();
      const refreshToken = auth.refreshToken;

      if (refreshToken && !isRefreshing) {
        isRefreshing = true;
        try {
          // Tạo một client thuần để gọi refresh, tránh bị dính lại middleware
          const refreshRes = await fetch(
            `${import.meta.env.VITE_API_BASE_URL ?? ""}/api/v1/auth/refresh`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ refreshToken }),
            },
          );

          if (refreshRes.ok) {
            const result = (await refreshRes.json()) as {
              data: { accessToken: string };
            };

            // Cập nhật accessToken mới vào store
            auth.setAccessToken(result.data.accessToken);
            return response;
          }
        } catch {
          // Bỏ qua lỗi mạng
        } finally {
          isRefreshing = false;
        }
      }

      auth.logout();
      if (
        typeof window !== "undefined" &&
        window.location.pathname !== "/login"
      ) {
        window.location.href = "/login";
      }
    }
    return response;
  },
};

export const api = createClient<paths>({
  baseUrl: import.meta.env.VITE_API_BASE_URL ?? "",
});

api.use(bearerMiddleware);

export interface ApiHealthStatus {
  readonly reachable: boolean;
  readonly message: string;
}

export async function fetchApiHealth(): Promise<ApiHealthStatus> {
  try {
    const { data } = await api.GET("/api/v1/health");
    if (!data) {
      return { reachable: false, message: "API tạm thời chưa phản hồi" };
    }
    return { reachable: true, message: data.data.message };
  } catch {
    return { reachable: false, message: "Chưa kết nối tới API :3000" };
  }
}
