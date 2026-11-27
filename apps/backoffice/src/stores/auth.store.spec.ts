import { beforeEach, describe, expect, it } from "bun:test";
import { getDefaultRouteForRole, useAuthStore } from "./auth.store";

describe("useAuthStore", () => {
  beforeEach(() => {
    useAuthStore.getState().logout();
  });

  it("sets authenticated session and clears on logout", () => {
    const mockUser = {
      id: "test-user-id",
      fullName: "Admin Test",
      email: "admin@greenroots.vn",
      role: "admin" as const,
    };

    useAuthStore.getState().setSession("test-access-token", mockUser);
    expect(useAuthStore.getState().user?.role).toBe("admin");
    expect(useAuthStore.getState().accessToken).toBe("test-access-token");

    useAuthStore.getState().logout();
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().accessToken).toBeNull();
    expect(useAuthStore.getState().refreshToken).toBeNull();
  });

  it("routes farm_staff to mobile farming logs and desk roles to orders", () => {
    expect(getDefaultRouteForRole("farm_staff")).toBe("/farming/logs");
    expect(getDefaultRouteForRole("sales")).toBe("/orders");
    expect(getDefaultRouteForRole("admin")).toBe("/orders");
    expect(getDefaultRouteForRole("super_admin")).toBe("/orders");
  });
});
