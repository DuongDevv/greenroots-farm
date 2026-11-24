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
  Label,
} from "@greenroots/ui";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  Key,
  Leaf,
  Loader2,
} from "lucide-react";
import { useState, type SubmitEvent } from "react";
import { api } from "@/lib/api-client";

export const Route = createFileRoute("/reset-password")({
  validateSearch: (search: Record<string, unknown>) => ({
    token: typeof search.token === "string" ? search.token : "",
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const { token } = Route.useSearch();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!token) {
      setErrorMessage(
        "Mã xác thực không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu gửi lại link mới.",
      );
      return;
    }

    if (password.length < 8) {
      setErrorMessage("Mật khẩu mới phải có độ dài tối thiểu 8 ký tự.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Mật khẩu xác nhận chưa khớp. Vui lòng kiểm tra lại.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const { error } = await api.POST("/api/v1/auth/reset-password", {
        body: {
          token,
          password,
          confirmPassword,
        },
      });

      if (error) {
        const errorDetail =
          ("detail" in error &&
            typeof error.detail === "string" &&
            error.detail) ||
          "Không thể đặt lại mật khẩu. Liên kết có thể đã hết hạn.";
        setErrorMessage(errorDetail);
        return;
      }

      setIsSuccess(true);
    } catch {
      setErrorMessage(
        "Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại mạng.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-surface-warm p-4">
      <main className="flex w-full max-w-md flex-col gap-6">
        {/* Brand Mark */}
        <div className="flex flex-col items-center gap-1 text-center">
          <div className="inline-flex items-center gap-2 text-brand-forest">
            <div className="flex size-9 items-center justify-center rounded-xl bg-brand-forest text-white">
              <Leaf className="size-5" />
            </div>
            <span className="text-xl font-black tracking-tight text-gray-900">
              GreenRoots <span className="text-brand-dark">Farm</span>
            </span>
          </div>
          <p className="text-xs text-gray-500">
            Từ Nông Trại Hữu Cơ Đến Bàn Ăn
          </p>
        </div>

        {/* Reset Password Card */}
        <Card className="border-border-subtle bg-white shadow-sm">
          <CardHeader className="space-y-3 pb-4">
            <div className="flex items-start gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-green-50 text-brand-forest">
                <Key className="size-6" />
              </span>
              <div className="space-y-1">
                <CardTitle className="text-lg font-extrabold text-gray-900">
                  Đặt lại mật khẩu
                </CardTitle>
                <CardDescription className="text-xs leading-relaxed text-gray-600">
                  Tạo mật khẩu mới để bảo vệ tài khoản GreenRoots Farm của bạn.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {errorMessage ? (
              <Alert
                role="alert"
                className="border-red-200 bg-red-50 text-red-900"
              >
                <AlertCircle className="size-4 text-red-600" />
                <AlertDescription className="text-xs">
                  {errorMessage}
                </AlertDescription>
              </Alert>
            ) : null}

            {isSuccess ? (
              <div className="space-y-4">
                <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-green-900">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="size-5 shrink-0 text-brand-forest" />
                    <div className="space-y-1 text-xs">
                      <p className="font-bold">Cập nhật mật khẩu thành công!</p>
                      <p className="leading-relaxed text-green-800">
                        Mật khẩu tài khoản của bạn đã được thay đổi. Bạn có thể
                        đăng nhập lại ngay bây giờ bằng mật khẩu mới.
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  type="button"
                  className="h-11 w-full bg-brand-forest font-bold text-white hover:bg-brand-dark"
                  onClick={() => void navigate({ to: "/login" })}
                >
                  Đăng nhập ngay
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* New Password */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="new-password"
                    className="text-xs font-bold text-gray-700"
                  >
                    Mật khẩu mới
                  </Label>
                  <div className="relative">
                    <Input
                      id="new-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Tối thiểu 8 ký tự"
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
                      aria-label={
                        showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"
                      }
                      className="absolute top-1/2 right-1 size-9 -translate-y-1/2 text-gray-400 hover:bg-transparent hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="confirm-password"
                    className="text-xs font-bold text-gray-700"
                  >
                    Xác nhận mật khẩu mới
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Nhập lại mật khẩu mới"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={isLoading}
                      required
                      className="h-11 pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      aria-label={
                        showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"
                      }
                      className="absolute top-1/2 right-1 size-9 -translate-y-1/2 text-gray-400 hover:bg-transparent hover:text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Password Policy Hint */}
                <div className="rounded-lg border border-border-subtle bg-gray-50/80 p-3 text-xs text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="size-4 text-brand-forest" />
                    <span>Tối thiểu 8 ký tự, gồm cả chữ và số</span>
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
                      <span>Đang cập nhật...</span>
                    </span>
                  ) : (
                    "Cập nhật mật khẩu"
                  )}
                </Button>
              </form>
            )}

            <div className="border-t border-border-subtle pt-3 text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-forest hover:underline"
              >
                <ArrowLeft className="size-4" />
                <span>Quay lại đăng nhập</span>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
