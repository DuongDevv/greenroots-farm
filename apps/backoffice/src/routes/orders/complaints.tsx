import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
  toast,
} from "@greenroots/ui";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Coins,
  FileCheck2,
  Gavel,
  Inbox,
  Pause,
  Phone,
  Play,
  ShieldCheck,
  Truck,
  User,
  Video,
  XCircle,
} from "lucide-react";

export const Route = createFileRoute("/orders/complaints")({
  component: ComplaintsManagementPage,
});

type ComplaintTriageStatus = "pending_triage" | "triaged" | "resolved";

interface EvidencePhoto {
  readonly src: string;
  readonly caption: string;
}

interface EvidenceVideo {
  readonly filename: string;
  readonly duration: string;
  readonly verified: boolean;
}

interface ComplaintRecord {
  readonly id: string;
  readonly orderId: string;
  readonly customer: string;
  readonly phone: string;
  readonly route: string;
  readonly category: string;
  readonly items: string;
  readonly batchCode: string;
  readonly claimAmountVnd: number;
  readonly createdAt: string;
  status: ComplaintTriageStatus;
  readonly description: string;
  readonly photos: readonly EvidencePhoto[];
  readonly video: EvidenceVideo | null;
  triageNote: string;
  resolutionSummary: string;
}

const INITIAL_COMPLAINTS: readonly ComplaintRecord[] = [
  {
    id: "KN-2026-109",
    orderId: "#GR-2026-8812",
    customer: "Trần Thị Thu Hà",
    phone: "0908 412 889",
    route: "Tuyến Đông (TP. Thủ Đức)",
    category: "Sản phẩm dập nát / hư hỏng",
    items: "1× Cà chua bi hữu cơ (250g)",
    batchCode: "LOT-CC-2604-B2",
    claimAmountVnd: 65000,
    createdAt: "Hôm nay, 09:42",
    status: "pending_triage",
    description:
      "Mở thùng giao hàng thấy hộp cà chua bi nằm dưới bị dập khoảng 30% trái, có nước rỉ ra ngoài túi giấy bảo quản.",
    photos: [
      {
        src: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80",
        caption: "Ảnh 1: Hộp cà chua bi bị dập khi mở thùng",
      },
      {
        src: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80",
        caption: "Ảnh 2: Rau củ đóng kèm bên trên hộp cà chua",
      },
    ],
    video: {
      filename: "video_khui_thung_8812.mp4",
      duration: "00:18",
      verified: true,
    },
    triageNote: "",
    resolutionSummary: "",
  },
  {
    id: "KN-2026-108",
    orderId: "#GR-2026-8795",
    customer: "Nguyễn Văn Minh",
    phone: "0913 774 210",
    route: "Tuyến Trung tâm (Quận 3)",
    category: "Rau lá bị héo đầu ngọn",
    items: "1× Cải bó xôi hữu cơ (300g)",
    batchCode: "LOT-DL-2604-A1",
    claimAmountVnd: 48000,
    createdAt: "Hôm nay, 08:15",
    status: "triaged",
    description:
      "Rau cải bó xôi giao đến bị héo phần ngọn lá, nghi do ngăn lạnh xe giao chưa đủ độ ẩm trong suốt hành trình.",
    photos: [
      {
        src: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&auto=format&fit=crop&q=80",
        caption: "Ảnh 1: Ngọn lá cải bó xôi có dấu hiệu héo",
      },
      {
        src: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80",
        caption: "Ảnh 2: Gói cải thìa đi kèm vẫn tươi bình thường",
      },
    ],
    video: {
      filename: "clip_kiem_tra_rau_8795.mp4",
      duration: "00:12",
      verified: true,
    },
    triageNote:
      "Lê Minh Tuấn (Sales): Đã đối chiếu ảnh thực tế, hợp lệ chính sách tươi sống 24h. Đề xuất Admin hoàn tiền hoặc gửi bù.",
    resolutionSummary: "",
  },
  {
    id: "KN-2026-107",
    orderId: "#GR-2026-8780",
    customer: "Phạm Ngọc Lan",
    phone: "0989 221 504",
    route: "Tuyến Bắc (Gò Vấp)",
    category: "Thiếu sản phẩm trong đơn",
    items: "1× Nấm đông cô tươi (200g)",
    batchCode: "LOT-CC-2604-M4",
    claimAmountVnd: 82000,
    createdAt: "Hôm qua, 17:30",
    status: "pending_triage",
    description:
      "Đơn đặt 4 món nhưng khi kiểm tra túi chỉ có 3 món, thiếu khay nấm đông cô tươi 200g đối chiếu trên phiếu giao.",
    photos: [
      {
        src: "https://images.unsplash.com/photo-1506806732259-39c2d0268443?w=600&auto=format&fit=crop&q=80",
        caption: "Ảnh 1: Sản phẩm thiếu đối chiếu trên phiếu đóng gói",
      },
    ],
    video: {
      filename: "unbox_don_8780.mp4",
      duration: "00:26",
      verified: true,
    },
    triageNote: "",
    resolutionSummary: "",
  },
  {
    id: "KN-2026-106",
    orderId: "#GR-2026-8761",
    customer: "Lê Quốc Bảo",
    phone: "0938 665 112",
    route: "Tuyến Đông (Bình Thạnh)",
    category: "Dập nát trong quá trình vận chuyển",
    items: "1× Cải xoăn Kale hữu cơ (250g)",
    batchCode: "LOT-DL-2604-K3",
    claimAmountVnd: 55000,
    createdAt: "Hôm qua, 14:10",
    status: "triaged",
    description:
      "Túi cải xoăn bị kẹp mép thùng xốp nên gãy cuống lá nhiều, dập nát khoảng 40%.",
    photos: [
      {
        src: "https://images.unsplash.com/photo-1524179091875-bf99a9a6fa57?w=600&auto=format&fit=crop&q=80",
        caption: "Ảnh 1: Cải xoăn Kale bị gãy dập cuống lá",
      },
    ],
    video: null,
    triageNote:
      "Lê Minh Tuấn (Sales): Khách gửi ảnh rõ nét trong vòng 2 giờ sau nhận hàng. Đủ điều kiện giải quyết.",
    resolutionSummary: "",
  },
  {
    id: "KN-2026-104",
    orderId: "#GR-2026-8720",
    customer: "Đặng Thảo Vy",
    phone: "0902 339 741",
    route: "Tuyến Trung tâm (Quận 1)",
    category: "Sai trọng lượng đóng gói",
    items: "1× Cà rốt ngọt Đà Lạt (500g)",
    batchCode: "LOT-DL-2604-C1",
    claimAmountVnd: 42000,
    createdAt: "2 ngày trước",
    status: "resolved",
    description:
      "Cân thực tế tại nhà chỉ được 360g thay vì 500g như niêm yết trên tem nhãn.",
    photos: [
      {
        src: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600&auto=format&fit=crop&q=80",
        caption: "Ảnh 1: Cân thực tế túi cà rốt 360g",
      },
    ],
    video: null,
    triageNote:
      "Lê Minh Tuấn (Sales): Xác nhận sai lệch cân định lượng tại trạm đóng gói.",
    resolutionSummary:
      "Admin Nguyễn Hoàng Anh: Đã tạo đơn bù 0₫ (#GR-2026-8890) — Giao ca sáng mai 07:30 – 09:30 xe lạnh.",
  },
];

const STATUS_METADATA: Record<
  ComplaintTriageStatus,
  { readonly label: string; readonly className: string }
> = {
  pending_triage: {
    label: "Chờ sơ duyệt",
    className: "bg-red-600 text-white hover:bg-red-700",
  },
  triaged: {
    label: "Đã sơ duyệt — Chờ Admin",
    className:
      "border border-green-600/30 bg-green-50 text-green-800 hover:bg-green-100",
  },
  resolved: {
    label: "Đã giải quyết",
    className: "bg-brand-forest text-white hover:bg-brand-dark",
  },
};

export function ComplaintsManagementPage() {
  const [complaints, setComplaints] =
    useState<readonly ComplaintRecord[]>(INITIAL_COMPLAINTS);
  const [activeFilter, setActiveFilter] = useState<
    "all" | ComplaintTriageStatus
  >("all");
  const [selectedId, setSelectedId] = useState<string>("KN-2026-109");
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);
  const [salesNoteInput, setSalesNoteInput] = useState<string>("");

  // Resolution Modal State
  const [isResolveModalOpen, setIsResolveModalOpen] = useState<boolean>(false);
  const [resolutionType, setResolutionType] = useState<
    "refund" | "replacement"
  >("refund");
  const [refundChannel, setRefundChannel] = useState<string>("PayOS");
  const [refundAmount, setRefundAmount] = useState<string>("65000");
  const [adminDecisionNote, setAdminDecisionNote] = useState<string>("");

  const pendingCount = complaints.filter(
    (c) => c.status === "pending_triage",
  ).length;
  const triagedCount = complaints.filter((c) => c.status === "triaged").length;
  const resolvedCount = complaints.filter(
    (c) => c.status === "resolved",
  ).length;

  const filteredComplaints = complaints.filter((c) => {
    if (activeFilter === "all") return true;
    return c.status === activeFilter;
  });

  const selectedComplaint =
    complaints.find((c) => c.id === selectedId) ?? filteredComplaints[0];

  const handleApproveTriage = (complaintId: string) => {
    const note =
      salesNoteInput.trim() ||
      "Lê Minh Tuấn (Sales): Đã đối chiếu ảnh & video bằng chứng, xác nhận hợp lệ chính sách tươi sống 24h. Chuyển Admin giải quyết.";

    setComplaints((prev) =>
      prev.map((c) =>
        c.id === complaintId
          ? { ...c, status: "triaged", triageNote: note }
          : c,
      ),
    );
    setSalesNoteInput("");
    toast.success(`Đã sơ duyệt phiếu ${complaintId} — Đã chuyển Admin xử lý!`);
  };

  const handleRejectTriage = (complaintId: string) => {
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === complaintId
          ? {
              ...c,
              status: "resolved",
              resolutionSummary:
                "Sales từ chối sơ duyệt: Bằng chứng chưa đủ điều kiện áp dụng chính sách tươi sống 24h hoặc gửi quá thời hạn quy định.",
            }
          : c,
      ),
    );
    toast.error(`Đã từ chối và đóng phiếu khiếu nại ${complaintId}.`);
  };

  const handleOpenResolveModal = (c: ComplaintRecord) => {
    setRefundAmount(String(c.claimAmountVnd));
    setResolutionType("refund");
    setAdminDecisionNote("");
    setIsResolveModalOpen(true);
  };

  const handleConfirmResolution = () => {
    if (!selectedComplaint) return;

    let summary = "";
    if (resolutionType === "refund") {
      summary = `Admin Nguyễn Hoàng Anh: Phê duyệt hoàn ${(Number(refundAmount) || selectedComplaint.claimAmountVnd).toLocaleString("vi-VN")}₫ qua cổng ${refundChannel}.${adminDecisionNote ? ` (${adminDecisionNote})` : ""}`;
      toast.success(
        `Đã phê duyệt hoàn tiền ${(Number(refundAmount) || selectedComplaint.claimAmountVnd).toLocaleString("vi-VN")}₫ qua ${refundChannel}!`,
      );
    } else {
      summary = `Admin Nguyễn Hoàng Anh: Đã duyệt tạo đơn giao bù 0₫ (#GR-2026-8894) — Giao ca sáng mai 07:30 – 09:30 xe lạnh.${adminDecisionNote ? ` (${adminDecisionNote})` : ""}`;
      toast.success(
        `Đã tạo đơn giao bù 0₫ cho khiếu nại ${selectedComplaint.id}!`,
      );
    }

    setComplaints((prev) =>
      prev.map((c) =>
        c.id === selectedComplaint.id
          ? { ...c, status: "resolved", resolutionSummary: summary }
          : c,
      ),
    );
    setIsResolveModalOpen(false);
  };

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 p-4 lg:p-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold tracking-wider text-green-700 uppercase">
              Quy trình bồi hoàn tươi sống 24h (BO-05)
            </span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 lg:text-3xl">
            Quản lý & Xử lý Khiếu nại
          </h1>
          <p className="max-w-2xl text-xs text-gray-600 sm:text-sm">
            Kiểm tra ảnh & video bằng chứng từ khách hàng, Sales sơ duyệt hợp lệ
            và Admin quyết định hoàn tiền (PayOS / điểm) hoặc tạo đơn bù 0₫.
          </p>
        </div>

        <Button
          variant="outline"
          className="shrink-0 gap-2 border-border-subtle bg-white font-bold"
        >
          <ShieldCheck className="size-4 text-brand-forest" />
          <span>Chính sách đổi trả 24h</span>
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <Card className="border-border-subtle bg-white shadow-xs">
          <CardHeader className="p-4 pb-2">
            <span className="text-xs font-semibold text-gray-500">
              Chờ sơ duyệt
            </span>
            <CardTitle className="text-2xl font-black text-red-600">
              {pendingCount} phiếu
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-xs text-gray-500">
            Cần kiểm tra ảnh & video
          </CardContent>
        </Card>

        <Card className="border-border-subtle bg-white shadow-xs">
          <CardHeader className="p-4 pb-2">
            <span className="text-xs font-semibold text-gray-500">
              Chờ Admin giải quyết
            </span>
            <CardTitle className="text-2xl font-black text-brand-forest">
              {triagedCount} phiếu
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-xs text-brand-dark">
            Sales đã sơ duyệt hợp lệ
          </CardContent>
        </Card>

        <Card className="border-border-subtle bg-white shadow-xs">
          <CardHeader className="p-4 pb-2">
            <span className="text-xs font-semibold text-gray-500">
              Đã giải quyết
            </span>
            <CardTitle className="text-2xl font-black text-gray-900">
              {resolvedCount} phiếu
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-xs text-gray-500">
            Hoàn tiền / Đơn bù 0₫
          </CardContent>
        </Card>

        <Card className="border-border-subtle bg-white shadow-xs">
          <CardHeader className="p-4 pb-2">
            <span className="text-xs font-semibold text-gray-500">
              Thời gian xử lý TB
            </span>
            <CardTitle className="text-2xl font-black text-gray-900">
              1.6 giờ
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-xs text-gray-500">
            Đạt chuẩn SLA dưới 4 giờ
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <Card className="border-border-subtle bg-white p-3 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant={activeFilter === "all" ? "default" : "outline"}
              className={
                activeFilter === "all"
                  ? "rounded-full bg-brand-forest font-bold text-white hover:bg-brand-dark"
                  : "rounded-full font-bold"
              }
              onClick={() => setActiveFilter("all")}
            >
              Tất cả ({complaints.length})
            </Button>
            <Button
              type="button"
              size="sm"
              variant={
                activeFilter === "pending_triage" ? "default" : "outline"
              }
              className={
                activeFilter === "pending_triage"
                  ? "rounded-full bg-brand-forest font-bold text-white hover:bg-brand-dark"
                  : "rounded-full font-bold"
              }
              onClick={() => setActiveFilter("pending_triage")}
            >
              Chờ sơ duyệt ({pendingCount})
            </Button>
            <Button
              type="button"
              size="sm"
              variant={activeFilter === "triaged" ? "default" : "outline"}
              className={
                activeFilter === "triaged"
                  ? "rounded-full bg-brand-forest font-bold text-white hover:bg-brand-dark"
                  : "rounded-full font-bold"
              }
              onClick={() => setActiveFilter("triaged")}
            >
              Đã sơ duyệt — Chờ Admin ({triagedCount})
            </Button>
            <Button
              type="button"
              size="sm"
              variant={activeFilter === "resolved" ? "default" : "outline"}
              className={
                activeFilter === "resolved"
                  ? "rounded-full bg-brand-forest font-bold text-white hover:bg-brand-dark"
                  : "rounded-full font-bold"
              }
              onClick={() => setActiveFilter("resolved")}
            >
              Đã giải quyết ({resolvedCount})
            </Button>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <AlertCircle className="size-4 text-brand-forest" />
            <span>Chọn phiếu để thẩm định chi tiết bằng chứng</span>
          </div>
        </div>
      </Card>

      {/* Master-Detail 12-Column Layout */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        {/* Left Column: List of Complaints (7 cols) */}
        <div className="space-y-3 lg:col-span-7">
          {filteredComplaints.length === 0 ? (
            <Card className="border-border-subtle bg-white p-8 text-center">
              <Inbox className="mx-auto size-10 text-gray-300" />
              <p className="mt-2 text-sm text-gray-500">
                Không tìm thấy phiếu khiếu nại nào trong mục này.
              </p>
            </Card>
          ) : (
            filteredComplaints.map((item) => {
              const isSelected = item.id === selectedComplaint?.id;
              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => {
                    setSelectedId(item.id);
                    setIsVideoPlaying(false);
                  }}
                  className={`w-full rounded-xl border p-4 text-left transition-all duration-150 ${
                    isSelected
                      ? "border-2 border-brand-forest bg-white shadow-md ring-2 ring-brand-forest/10"
                      : "border-border-subtle bg-white hover:border-gray-300 hover:bg-gray-50/50"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-brand-dark">
                        {item.id}
                      </span>
                      <span className="h-3 w-px bg-gray-200" />
                      <span className="text-xs font-bold text-gray-500">
                        {item.orderId}
                      </span>
                    </div>
                    <Badge className={STATUS_METADATA[item.status].className}>
                      {STATUS_METADATA[item.status].label}
                    </Badge>
                  </div>

                  <div className="mt-2">
                    <h3 className="text-sm font-bold text-gray-900">
                      {item.category}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-xs text-gray-600">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-2 text-xs text-gray-500">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 font-semibold">
                        <User className="size-3.5 text-brand-forest" />
                        {item.customer}
                      </span>
                      <span>
                        {item.photos.length} ảnh
                        {item.video ? ", 1 video" : ""}
                      </span>
                    </div>
                    <span className="font-bold text-gray-900">
                      {item.claimAmountVnd.toLocaleString("vi-VN")}₫
                    </span>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Right Column: Evidence & Action Workspace (5 cols, sticky) */}
        {selectedComplaint && (
          <div className="lg:sticky lg:top-6 lg:col-span-5">
            <Card className="border-border-subtle bg-white shadow-sm">
              <CardHeader className="border-b border-border-subtle p-5 pb-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black text-brand-dark">
                      {selectedComplaint.id}
                    </span>
                    <span className="text-xs font-bold text-gray-500">
                      {selectedComplaint.orderId}
                    </span>
                  </div>
                  <Badge
                    className={
                      STATUS_METADATA[selectedComplaint.status].className
                    }
                  >
                    {STATUS_METADATA[selectedComplaint.status].label}
                  </Badge>
                </div>
                <CardTitle className="mt-2 text-base font-bold text-gray-900">
                  {selectedComplaint.category}
                </CardTitle>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock className="size-3.5" />
                  <span>{selectedComplaint.createdAt}</span>
                  <span>•</span>
                  <span>{selectedComplaint.route}</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 p-5">
                {/* Order & Customer Metadata */}
                <div className="rounded-lg border border-border-subtle bg-gray-50/70 p-3 text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-gray-400">Khách hàng:</span>
                      <p className="font-bold text-gray-900">
                        {selectedComplaint.customer}
                      </p>
                      <p className="flex items-center gap-1 text-gray-600">
                        <Phone className="size-3" />
                        {selectedComplaint.phone}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-400">Lô xuất kho (FEFO):</span>
                      <p className="font-bold text-brand-dark">
                        {selectedComplaint.batchCode}
                      </p>
                      <p className="text-gray-600">
                        Mã đơn: {selectedComplaint.orderId}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2.5 flex items-center justify-between border-t border-gray-200 pt-2 font-medium">
                    <span className="text-gray-700">
                      {selectedComplaint.items}
                    </span>
                    <span className="font-black text-brand-dark">
                      {selectedComplaint.claimAmountVnd.toLocaleString("vi-VN")}
                      ₫
                    </span>
                  </div>
                </div>

                {/* Customer Claim Description */}
                <div>
                  <h4 className="text-xs font-bold tracking-wider text-gray-500 uppercase">
                    Mô tả của khách hàng
                  </h4>
                  <p className="mt-1 rounded-lg bg-gray-50 p-3 text-xs leading-relaxed text-gray-700">
                    {selectedComplaint.description}
                  </p>
                </div>

                {/* Evidence Gallery */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-gray-900">
                      Bằng chứng nông sản dập nát (
                      {selectedComplaint.photos.length} ảnh
                      {selectedComplaint.video ? ", 1 video" : ""})
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-green-700">
                      <ShieldCheck className="size-3.5" />
                      Đã xác thực
                    </span>
                  </div>

                  {/* Photo Grid */}
                  <div className="grid grid-cols-2 gap-2">
                    {selectedComplaint.photos.map((photo, idx) => (
                      <figure
                        key={idx}
                        className="overflow-hidden rounded-lg border border-border-subtle bg-gray-100"
                      >
                        <img
                          src={photo.src}
                          alt={photo.caption}
                          className="h-28 w-full object-cover transition-transform hover:scale-105"
                        />
                        <figcaption className="line-clamp-1 p-1.5 text-[11px] text-gray-600">
                          {photo.caption}
                        </figcaption>
                      </figure>
                    ))}
                  </div>

                  {/* Video Evidence Card */}
                  {selectedComplaint.video && (
                    <div className="flex items-center justify-between gap-3 rounded-lg border border-border-subtle bg-gray-50 p-2.5 text-xs">
                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                          className="flex size-8 items-center justify-center rounded-full bg-brand-forest text-white transition-colors hover:bg-brand-dark"
                        >
                          {isVideoPlaying ? (
                            <Pause className="size-4" />
                          ) : (
                            <Play className="ml-0.5 size-4" />
                          )}
                        </button>
                        <div>
                          <p className="font-bold text-gray-900">
                            {selectedComplaint.video.filename}
                          </p>
                          <p className="text-gray-500">
                            {isVideoPlaying
                              ? "Đang phát video khui thùng đối chiếu..."
                              : `Thời lượng ${selectedComplaint.video.duration} (Đã xác thực tem QR)`}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="gap-1 text-[11px]">
                        <Video className="size-3" />
                        Video
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Workflow Actions Based on State */}
                <div className="border-t border-border-subtle pt-4">
                  {selectedComplaint.status === "pending_triage" && (
                    <div className="space-y-3">
                      <div>
                        <Label
                          htmlFor="triage-note"
                          className="text-xs font-bold text-gray-700"
                        >
                          Ghi chú sơ duyệt của Sales
                        </Label>
                        <Textarea
                          id="triage-note"
                          rows={2}
                          value={salesNoteInput}
                          onChange={(e) => setSalesNoteInput(e.target.value)}
                          placeholder="Nhập nhận xét sau khi kiểm tra ảnh/video đối chiếu chính sách 24h..."
                          className="mt-1 text-xs"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          className="flex-1 gap-1.5 bg-brand-forest font-bold text-white hover:bg-brand-dark"
                          onClick={() =>
                            handleApproveTriage(selectedComplaint.id)
                          }
                        >
                          <FileCheck2 className="size-4" />
                          <span>Sơ duyệt hợp lệ</span>
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          className="gap-1.5 border-red-200 text-red-600 hover:bg-red-50"
                          onClick={() =>
                            handleRejectTriage(selectedComplaint.id)
                          }
                        >
                          <XCircle className="size-4" />
                          <span>Từ chối</span>
                        </Button>
                      </div>
                    </div>
                  )}

                  {selectedComplaint.status === "triaged" && (
                    <div className="space-y-3">
                      <div className="rounded-lg border border-green-200 bg-green-50/70 p-3 text-xs">
                        <span className="font-bold text-green-900">
                          Kết quả sơ duyệt từ Sales:
                        </span>
                        <p className="mt-1 text-green-800">
                          {selectedComplaint.triageNote}
                        </p>
                      </div>

                      <Button
                        type="button"
                        className="w-full gap-2 bg-brand-forest py-2.5 font-bold text-white hover:bg-brand-dark"
                        onClick={() =>
                          handleOpenResolveModal(selectedComplaint)
                        }
                      >
                        <Gavel className="size-4" />
                        <span>Giải quyết: Hoàn tiền / Đơn bù 0₫</span>
                      </Button>
                    </div>
                  )}

                  {selectedComplaint.status === "resolved" && (
                    <div className="rounded-lg border border-brand-forest/20 bg-green-50/50 p-3 text-xs">
                      <span className="font-bold text-brand-dark">
                        Quyết định giải quyết của Ban Quản Trị:
                      </span>
                      <p className="mt-1 text-gray-800">
                        {selectedComplaint.resolutionSummary}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Admin Resolution Dialog */}
      <Dialog open={isResolveModalOpen} onOpenChange={setIsResolveModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-black text-gray-900">
              <Gavel className="size-5 text-brand-forest" />
              <span>Giải quyết khiếu nại bồi hoàn</span>
            </DialogTitle>
          </DialogHeader>

          {selectedComplaint && (
            <div className="space-y-4 text-xs">
              {/* Order Recap */}
              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                <div>
                  <span className="font-bold text-brand-dark">
                    {selectedComplaint.id}
                  </span>
                  <span className="mx-2 text-gray-400">•</span>
                  <span className="text-gray-600">
                    {selectedComplaint.orderId}
                  </span>
                  <p className="text-gray-500">
                    {selectedComplaint.customer} — {selectedComplaint.items}
                  </p>
                </div>
                <span className="text-sm font-black text-gray-900">
                  {selectedComplaint.claimAmountVnd.toLocaleString("vi-VN")}₫
                </span>
              </div>

              {/* Resolution Options */}
              <div className="space-y-2">
                <Label className="text-xs font-bold text-gray-700">
                  Chọn phương án giải quyết
                </Label>
                <RadioGroup
                  value={resolutionType}
                  onValueChange={(val) =>
                    setResolutionType(val as "refund" | "replacement")
                  }
                  className="space-y-2"
                >
                  {/* Option 1: Refund */}
                  <label
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors ${
                      resolutionType === "refund"
                        ? "border-2 border-brand-forest bg-green-50/40"
                        : "border-border-subtle bg-white hover:bg-gray-50"
                    }`}
                  >
                    <RadioGroupItem
                      value="refund"
                      id="opt-refund"
                      className="mt-0.5"
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between font-bold text-gray-900">
                        <span>Hoàn tiền (PayOS / Điểm thưởng)</span>
                        <Coins className="size-4 text-brand-forest" />
                      </div>
                      <p className="text-gray-500">
                        Chuyển khoản trực tiếp qua PayOS hoặc quy đổi điểm
                        thưởng GreenRoots (+10% giá trị bồi hoàn).
                      </p>

                      {resolutionType === "refund" && (
                        <div className="grid grid-cols-2 gap-2 pt-2">
                          <div>
                            <Label className="text-[11px] text-gray-600">
                              Kênh hoàn tiền
                            </Label>
                            <Select
                              value={refundChannel}
                              onValueChange={(val) => {
                                if (val) setRefundChannel(val);
                              }}
                            >
                              <SelectTrigger className="mt-1 h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="PayOS">
                                  Chuyển khoản PayOS
                                </SelectItem>
                                <SelectItem value="Điểm thưởng GreenRoots">
                                  Điểm thưởng (+10%)
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label className="text-[11px] text-gray-600">
                              Số tiền hoàn (₫)
                            </Label>
                            <Input
                              type="number"
                              value={refundAmount}
                              onChange={(e) => setRefundAmount(e.target.value)}
                              className="mt-1 h-8 text-xs font-bold"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </label>

                  {/* Option 2: Replacement */}
                  <label
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors ${
                      resolutionType === "replacement"
                        ? "border-2 border-brand-forest bg-green-50/40"
                        : "border-border-subtle bg-white hover:bg-gray-50"
                    }`}
                  >
                    <RadioGroupItem
                      value="replacement"
                      id="opt-replacement"
                      className="mt-0.5"
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between font-bold text-gray-900">
                        <span>Tạo đơn giao bù 0₫</span>
                        <Truck className="size-4 text-brand-forest" />
                      </div>
                      <p className="text-gray-500">
                        Tự động sinh đơn giao bù 0₫ vào ca giao xe lạnh gần nhất
                        và giữ lô thu hoạch mới theo thuật toán FEFO.
                      </p>

                      {resolutionType === "replacement" && (
                        <div className="mt-2 rounded-md bg-green-100/60 p-2 text-green-900">
                          <span className="font-bold">
                            Lịch giao bù dự kiến: Ca sáng mai (07:30 – 09:30),
                            Phí vận chuyển 0₫
                          </span>
                        </div>
                      )}
                    </div>
                  </label>
                </RadioGroup>
              </div>

              {/* Admin Decision Note */}
              <div>
                <Label
                  htmlFor="admin-note"
                  className="text-xs font-bold text-gray-700"
                >
                  Ghi chú quyết định của Admin
                </Label>
                <Textarea
                  id="admin-note"
                  rows={2}
                  value={adminDecisionNote}
                  onChange={(e) => setAdminDecisionNote(e.target.value)}
                  placeholder="Ví dụ: Đã duyệt bồi hoàn theo chính sách tươi sống 24h..."
                  className="mt-1 text-xs"
                />
              </div>
            </div>
          )}

          <DialogFooter className="mt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsResolveModalOpen(false)}
            >
              Hủy bỏ
            </Button>
            <Button
              type="button"
              size="sm"
              className="gap-1.5 bg-brand-forest font-bold text-white hover:bg-brand-dark"
              onClick={handleConfirmResolution}
            >
              <CheckCircle2 className="size-4" />
              <span>Xác nhận giải quyết</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
