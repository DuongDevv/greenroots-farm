import { beforeEach, describe, expect, it } from "bun:test";
import { getDefaultRouteForRole, useAuthStore } from "./auth.store";

describe("useAuthStore", () => {
  beforeEach(() => {
    useAuthStore.getState().logout();
  });

  it("logs in a demo internal role and clears on logout", () => {
    useAuthStore.getState().loginDemoRole("farm_staff");
    expect(useAuthStore.getState().user?.role).toBe("farm_staff");
    expect(useAuthStore.getState().accessToken).toBe("demo-jwt-farm_staff");
    expect(useAuthStore.getState().refreshToken).toBe(
      "demo-refresh-farm_staff",
    );

    useAuthStore.getState().logout();
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().accessToken).toBeNull();
    expect(useAuthStore.getState().refreshToken).toBeNull();
  });

  it("sets live session with access and refresh tokens", () => {
    const mockUser = {
      id: "0195a8f0-0001-7000-8000-000000000099",
      fullName: "Kỹ sư Thực Tế",
      email: "engineer@greenroots.vn",
      role: "farm_staff" as const,
    };

    useAuthStore
      .getState()
      .setSession("live-access-token", mockUser, "live-refresh-token");
    expect(useAuthStore.getState().user).toEqual(mockUser);
    expect(useAuthStore.getState().accessToken).toBe("live-access-token");
    expect(useAuthStore.getState().refreshToken).toBe("live-refresh-token");

    useAuthStore.getState().setAccessToken("renewed-access-token");
    expect(useAuthStore.getState().accessToken).toBe("renewed-access-token");
    expect(useAuthStore.getState().refreshToken).toBe("live-refresh-token");
  });

  it("ignores non-internal roles", () => {
    useAuthStore.getState().loginDemoRole("customer");
    expect(useAuthStore.getState().user).toBeNull();
  });

  it("routes farm_staff to mobile farming logs and desk roles to orders", () => {
    expect(getDefaultRouteForRole("farm_staff")).toBe("/farming/logs");
    expect(getDefaultRouteForRole("sales")).toBe("/orders");
    expect(getDefaultRouteForRole("admin")).toBe("/orders");
    expect(getDefaultRouteForRole("super_admin")).toBe("/orders");
  });
});
