import type { UserRole } from "@greenroots/shared";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface BackofficeUser {
  readonly id: string;
  readonly fullName: string;
  readonly email: string;
  readonly role: UserRole;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: BackofficeUser | null;
  setSession: (
    accessToken: string,
    user: BackofficeUser,
    refreshToken?: string | null,
  ) => void;
  setAccessToken: (accessToken: string) => void;
  logout: () => void;
}

const ssrMemoryFallback = new Map<string, string>();

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      setSession: (accessToken, user, refreshToken = null) =>
        set({ accessToken, user, refreshToken }),
      setAccessToken: (accessToken) => set({ accessToken }),
      logout: () => set({ accessToken: null, refreshToken: null, user: null }),
    }),
    {
      name: "greenroots-backoffice-auth",
      storage: createJSONStorage(() =>
        typeof window === "undefined"
          ? {
              getItem: (key) => ssrMemoryFallback.get(key) ?? null,
              setItem: (key, value) => {
                ssrMemoryFallback.set(key, value);
              },
              removeItem: (key) => {
                ssrMemoryFallback.delete(key);
              },
            }
          : window.localStorage,
      ),
    },
  ),
);

export function getDefaultRouteForRole(role: UserRole): string {
  if (role === "farm_staff") return "/farming/logs";
  return "/orders";
}
