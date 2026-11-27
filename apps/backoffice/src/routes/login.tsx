import {
  Alert,
  AlertDescription,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  toast,
} from "@greenroots/ui";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AlertCircle, Eye, EyeOff, Leaf, Loader2 } from "lucide-react";
import { useState, type SubmitEvent } from "react";
import { api } from "@/lib/api-client";
import { getDefaultRouteForRole, useAuthStore } from "@/stores/auth.store";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const setSession = useAuthStore((state) => state.setSession);
  const navigate = useNavigate();

  // Xử lý đăng nhập bằng API thật
  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim() || !password) {
      setErrorMessage("Vui lòng nhập đầy đủ email và mật khẩu.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const { data, error } = await api.POST("/api/v1/auth/login", {
        body: {
          email: email.trim(),
          password,
        },
      });

      if (error) {
        const errorDetail =
          ("detail" in error &&
            typeof error.detail === "string" &&
            error.detail) ||
          "Email hoặc mật khẩu không chính xác.";
        setErrorMessage(errorDetail);
        return;
      }

      const { accessToken, refreshToken, user } = data.data;

      // BẢO VỆ BỀ MẶT: Chặn tài khoản khách hàng đăng nhập vào Backoffice
      if (user.role === "customer") {
        setErrorMessage(
          "Tài khoản khách hàng không có quyền truy cập Backoffice nội bộ.",
        );
        return;
      }

      // Lưu phiên đăng nhập bền vững
      setSession(accessToken, user, refreshToken);
      toast.success(`Chào mừng trở lại, ${user.fullName}!`);

      // Điều hướng tới đúng trang theo vai trò
      void navigate({ to: getDefaultRouteForRole(user.role) });
    } catch {
      setErrorMessage(
        "Không thể kết nối đến máy chủ API. Vui lòng kiểm tra lại mạng.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-surface-warm p-4">
      <Card className="w-full max-w-md border-border-subtle bg-white shadow-sm">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-brand-forest text-white">
            <Leaf className="size-6" />
          </div>
          <CardTitle className="text-xl font-extrabold text-gray-900">
            GreenRoots Backoffice
          </CardTitle>
          <CardDescription>
            Cổng vận hành nội bộ — Farm Staff, Sales, Admin &amp; SuperAdmin
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-3">
            {errorMessage ? (
              <Alert
                role="alert"
                className="border-red-200 bg-red-50 text-red-900"
              >
                <AlertCircle
                  className="size-4 text-red-600"
                  aria-hidden="true"
                />
                <AlertDescription className="text-xs">
                  {errorMessage}
                </AlertDescription>
              </Alert>
            ) : null}

            <div className="space-y-1">
              <Input
                type="email"
                placeholder="Email nội bộ (@greenroots.vn)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
                className="h-11"
              />
            </div>

            <div className="space-y-1">
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                  className="h-11 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  className="absolute top-1/2 right-1 size-9 -translate-y-1/2 text-gray-400 hover:bg-transparent hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </Button>
              </div>

              <div className="flex justify-end pt-1">
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-brand-forest hover:underline"
                >
                  Quên mật khẩu?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="h-11 w-full bg-brand-forest font-bold text-white hover:bg-brand-dark"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" />
                  <span>Đang xác thực...</span>
                </span>
              ) : (
                "Đăng nhập"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
