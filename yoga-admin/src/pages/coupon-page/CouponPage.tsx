"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Plus,
  Search,
  Calendar,
  Tag,
  Users,
  Percent,
  DollarSign,
  Copy,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

import { CreateCouponModal, StatCard } from "./StatCard";
import { CouponService } from "@/service/coupon.service";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";

// --- Types (ตรงกับ Prisma Schema) ---
type CouponType = "FIXED_AMOUNT" | "PERCENTAGE";

export interface Coupon {
  id: string;
  code: string;
  type: CouponType;
  value: number;
  minSpend: number;
  maxDiscount?: number;
  usageLimit?: number; // null = unlimited
  currentUses: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

const CouponPage = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // --- Filter Logic ---
  const filteredCoupons = coupons.filter((c) =>
    c.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- Handlers ---
  const handleStatusToggle = (id: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Copied "${text}" to clipboard!`);
  };

  const fetchCoupons = useCallback(async () => {
    try {
      const response = await CouponService.getCoupon();
      setCoupons(response);
    } catch (error) {
      console.error("Error fetching coupons:", error);
    }
  }, []);

  const handleDeleteCoupon = async (id: string) => {
    try {
      await CouponService.deleteCoupon(id);
      toast.success("Coupon deleted successfully!");
    } catch (error) {
      console.error("Error deleting coupon:", error);
      toast.error("Failed to delete coupon");
    } finally {
      void fetchCoupons();
    }
  };

  const handleStatusChange = async (id: string, isActive: boolean) => {
    try {
      await CouponService.statusCoupon({ id, isActive });
      toast.success("Status updated successfully!");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    } finally {
      void fetchCoupons();
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchCoupons();
  }, [fetchCoupons]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-800">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            จัดการคูปองส่วนลด
          </h1>
          <p className="text-slate-500">
            สร้างและจัดการแคมเปญส่งเสริมการขายของคุณ
          </p>
        </div>
        <Button
          variant={"outline"}
          onClick={() => setIsModalOpen(true)}
          className="cursor-pointer"
        >
          <Plus size={20} />
          สร้างคูปองใหม่
        </Button>
      </div>

      {/* Stats Cards (Optional) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="คูปองทั้งหมด"
          value={coupons.length.toString()}
          icon={<Tag className="text-blue-500" />}
        />
        <StatCard
          title="กำลังใช้งาน (Active)"
          value={coupons.filter((c) => c.isActive).length.toString()}
          icon={<Users className="text-green-500" />}
        />
        <StatCard
          title="หมดอายุ/เต็ม"
          value={coupons
            .filter(
              (c) =>
                !c.isActive || (c.usageLimit && c.currentUses >= c.usageLimit)
            )
            .length.toString()}
          icon={<Calendar className="text-red-500" />}
        />
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-t-xl border-b border-gray-100 flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="ค้นหารหัสคูปอง..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-b-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm font-medium">
                <th className="p-4 border-b">รหัสคูปอง</th>
                <th className="p-4 border-b">มูลค่าส่วนลด</th>
                <th className="p-4 border-b">เงื่อนไข (ขั้นต่ำ/Max)</th>
                <th className="p-4 border-b">การใช้งาน (สิทธิ์)</th>
                <th className="p-4 border-b">ระยะเวลา</th>
                <th className="p-4 border-b">สถานะ</th>
                <th className="p-4 border-b text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredCoupons.map((coupon) => (
                <tr
                  key={coupon.id}
                  className="hover:bg-gray-50 group transition-colors"
                >
                  <td className="p-4 border-b">
                    <div className="flex items-center gap-2">
                      <div className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100">
                        {coupon.code}
                      </div>
                      <button
                        onClick={() => copyToClipboard(coupon.code)}
                        className="text-gray-400 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Copy size={14} />
                      </button>
                    </div>
                  </td>

                  <td className="p-4 border-b">
                    <div className="flex items-center gap-2 font-medium">
                      {coupon.type === "PERCENTAGE" ? (
                        <span className="flex items-center text-orange-600">
                          <Percent size={16} className="mr-1" /> {coupon.value}%
                        </span>
                      ) : (
                        <span className="flex items-center text-green-600">
                          <DollarSign size={16} className="mr-1" /> ฿
                          {coupon.value}
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="p-4 border-b text-gray-500">
                    <div className="flex flex-col gap-1 text-xs">
                      <span>
                        Min:{" "}
                        {coupon.minSpend > 0
                          ? `฿${coupon.minSpend}`
                          : "ไม่มีขั้นต่ำ"}
                      </span>
                      {coupon.type === "PERCENTAGE" && coupon.maxDiscount && (
                        <span className="text-orange-500">
                          Max: ฿{coupon.maxDiscount}
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="p-4 border-b">
                    <div className="w-32">
                      <div className="flex justify-between text-xs mb-1 text-gray-600">
                        <span>{coupon.currentUses} ใช้แล้ว</span>
                        <span>
                          {coupon.usageLimit ? `/ ${coupon.usageLimit}` : "∞"}
                        </span>
                      </div>
                      {coupon.usageLimit && (
                        <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              coupon.currentUses >= coupon.usageLimit
                                ? "bg-red-500"
                                : "bg-green-500"
                            }`}
                            style={{
                              width: `${Math.min(
                                (coupon.currentUses / coupon.usageLimit) * 100,
                                100
                              )}%`,
                            }}
                          ></div>
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="p-4 border-b text-gray-500 text-xs">
                    <div className="flex flex-col">
                      <span>
                        {format(new Date(coupon.startDate), "dd MMM yyyy")}
                      </span>
                      <span className="text-gray-400">ถึง</span>
                      <span>
                        {format(new Date(coupon.endDate), "dd MMM yyyy")}
                      </span>
                    </div>
                  </td>

                  <td className="p-4 border-b">
                    <button
                      onClick={() => handleStatusToggle(coupon.id)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        coupon.isActive
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-red-100 text-red-700 hover:bg-red-200"
                      }`}
                    >
                      {coupon.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>

                  <td className="p-4 border-b text-right">
                    <div className="flex justify-end items-center gap-4">
                      <Switch
                        className="cursor-pointer"
                        checked={coupon.isActive}
                        onCheckedChange={(checked) =>
                          handleStatusChange(coupon.id, checked)
                        }
                      />
                      <Dialog>
                        <DialogTrigger asChild>
                          <button className="p-2 hover:bg-red-50 rounded text-gray-500 hover:text-red-600 transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </DialogTrigger>
                        <DialogContent>
                          <AlertDialogHeader>
                            <DialogTitle>ลบคูปอง : {coupon.code}</DialogTitle>
                            <DialogDescription>
                              คุณต้องการลบคูปองนี้ใช่หรือไม่?
                              (ถ้าลบเเล้วข้อมูลที่ใช้งานกับคูปองนี้จะหายทั้งหมด)
                            </DialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="flex justify-end gap-2">
                            <DialogClose asChild>
                              <Button className="bg-gray-500! hover:bg-gray-600">
                                ยกเลิก
                              </Button>
                            </DialogClose>
                            <Button
                              onClick={() => handleDeleteCoupon(coupon.id)}
                              className="bg-red-500! hover:bg-red-600"
                            >
                              ลบ
                            </Button>
                          </AlertDialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredCoupons.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              ไม่พบคูปองที่ค้นหา
            </div>
          )}
        </div>
      </div>

      {/* --- Create Modal --- */}
      {isModalOpen && (
        <CreateCouponModal
          onClose={() => {
            setIsModalOpen(false);
            void fetchCoupons();
          }}
        />
      )}
    </div>
  );
};

// --- Sub-components ---

export default CouponPage;
