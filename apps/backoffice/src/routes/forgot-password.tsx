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
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  KeyRound,
  Leaf,
  Loader2,
} from "lucide-react";
import { useState, type SubmitEvent } from "react";
import { api } from "@/lib/api-client";

export const Route = createFileRoute("/forgot-password")({
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) {
      setErrorMessage("Vui lòng nhập địa chỉ email nội bộ.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const { error } = await api.POST("/api/v1/auth/forgot-password", {
        body: {
          email: email.trim(),
        },
      });

      if (error) {
        const errorDetail =
          ("detail" in error &&
            typeof error.detail === "string" &&
            error.detail) ||
          "Không tìm thấy tài khoản với email này.";
        setErrorMessage(errorDetail);
        return;
      }

      setIsSubmitted(true);
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

        {/* Forgot Password Card */}
        <Card className="border-border-subtle bg-white shadow-sm">
          <CardHeader className="space-y-3 pb-4">
            <div className="flex items-start gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-green-50 text-brand-forest">
                <KeyRound className="size-6" />
              </span>
              <div className="space-y-1">
                <CardTitle className="text-lg font-extrabold text-gray-900">
                  Quên mật khẩu
                </CardTitle>
                <CardDescription className="text-xs leading-relaxed text-gray-600">
                  Nhập email nội bộ đã được cấp quyền quản trị để nhận liên kết
                  đặt lại mật khẩu.
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

            {isSubmitted ? (
              <div className="space-y-4">
                <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-green-900">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="size-5 shrink-0 text-brand-forest" />
                    <div className="space-y-1 text-xs">
                      <p className="font-bold">Đã gửi hướng dẫn khôi phục!</p>
                      <p className="leading-relaxed text-green-800">
                        Chúng tôi đã gửi liên kết đặt lại mật khẩu tới{" "}
                        <strong>{email}</strong>. Liên kết có hiệu lực trong 15
                        phút. Vui lòng kiểm tra hộp thư của bạn.
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full text-xs font-semibold"
                  onClick={() => setIsSubmitted(false)}
                >
                  Gửi lại cho email khác
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="forgot-email"
                    className="text-xs font-bold text-gray-700"
                  >
                    Email nội bộ
                  </Label>
                  <Input
                    id="forgot-email"
                    type="email"
                    placeholder="ten@greenroots.vn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    required
                    className="h-11"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="h-11 w-full bg-brand-forest font-bold text-white hover:bg-brand-dark"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="size-4 animate-spin" />
                      <span>Đang gửi yêu cầu...</span>
                    </span>
                  ) : (
                    "Gửi liên kết khôi phục"
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
