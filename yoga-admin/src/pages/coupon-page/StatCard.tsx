import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CouponService } from "@/service/coupon.service";
import { X } from "lucide-react";
import { useState } from "react";

type CouponType = "FIXED_AMOUNT" | "PERCENTAGE";

const StatCard = ({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
    <div>
      <p className="text-sm text-gray-500 mb-1">{title}</p>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
    </div>
    <div className="p-3 bg-gray-50 rounded-lg">{icon}</div>
  </div>
);

const CreateCouponModal = ({ onClose }: { onClose: () => void }) => {
  // Form States (Simplified)
  const [type, setType] = useState<CouponType>("FIXED_AMOUNT");
  const [payload, setPayload] = useState({
    code: "",
    type: type,
    value: 0,
    minSpend: 0,
    usageLimit: 0,
    userLimit: 0,
    maxDiscount: 0,
    startDate: new Date(),
    endDate: new Date(),
    isActive: false,
  });

  const handleSubmit = async () => {
    try {
      await CouponService.createCoupon(payload);
    } catch (error) {
      console.error(error);
    } finally {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white  rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-lg text-slate-800">สร้างคูปองใหม่</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* รหัสคูปอง */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                รหัสคูปอง (Code)
              </label>
              <input
                type="text"
                value={payload.code}
                onChange={(e) =>
                  setPayload({ ...payload, code: e.target.value })
                }
                placeholder="เช่น SUMMER2024"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none uppercase font-mono"
              />
              <p className="text-xs text-gray-500 mt-1">
                ภาษาอังกฤษตัวพิมพ์ใหญ่และตัวเลขเท่านั้น
              </p>
            </div>

            {/* ประเภท & มูลค่า */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ประเภทส่วนลด
              </label>
              <Select
                value={type}
                onValueChange={(value) => {
                  setType(value as CouponType);
                  setPayload({ ...payload, type: value as CouponType });
                }}
              >
                <SelectTrigger className="h-full w-full grow">
                  <SelectValue placeholder="ประเภทส่วนลด" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FIXED_AMOUNT">
                    ลดเป็นจำนวนเงิน (บาท)
                  </SelectItem>
                  <SelectItem value="PERCENTAGE">
                    ลดเป็นเปอร์เซ็นต์ (%)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                มูลค่า {type === "PERCENTAGE" ? "(%)" : "(บาท)"}
              </label>
              <input
                type="number"
                value={payload.value}
                onChange={(e) =>
                  setPayload({ ...payload, value: Number(e.target.value) })
                }
                placeholder="0"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* เงื่อนไขการใช้ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ยอดซื้อขั้นต่ำ (บาท)
              </label>
              <input
                type="number"
                value={payload.minSpend}
                onChange={(e) =>
                  setPayload({ ...payload, minSpend: Number(e.target.value) })
                }
                placeholder="0"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {type === "PERCENTAGE" ? "ลดสูงสุด (บาท)" : " "}
              </label>
              {type === "PERCENTAGE" ? (
                <input
                  type="number"
                  value={payload.maxDiscount}
                  onChange={(e) =>
                    setPayload({
                      ...payload,
                      maxDiscount: Number(e.target.value),
                    })
                  }
                  placeholder="ไม่จำกัด"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              ) : (
                <div className="h-10"></div> // Spacer
              )}
            </div>

            {/* วันที่ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                วันเริ่มใช้งาน
              </label>
              <input
                type="date"
                value={payload.startDate.toISOString().split("T")[0]}
                onChange={(e) =>
                  setPayload({
                    ...payload,
                    startDate: new Date(e.target.value),
                  })
                }
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                วันหมดอายุ
              </label>
              <input
                type="date"
                value={payload.endDate.toISOString().split("T")[0]}
                onChange={(e) =>
                  setPayload({ ...payload, endDate: new Date(e.target.value) })
                }
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* ข้อจำกัด */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                จำนวนสิทธิ์ทั้งหมด
              </label>
              <input
                type="number"
                value={payload.usageLimit}
                onChange={(e) =>
                  setPayload({ ...payload, usageLimit: Number(e.target.value) })
                }
                placeholder="ไม่จำกัด"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                จำกัดสิทธิ์ต่อคน
              </label>
              <input
                type="number"
                value={payload.userLimit}
                onChange={(e) =>
                  setPayload({ ...payload, userLimit: Number(e.target.value) })
                }
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 cursor-pointer text-gray-600 hover:bg-gray-200 rounded-lg font-medium transition-colors"
          >
            ยกเลิก
          </button>
          <Button
            variant={"outline"}
            onClick={handleSubmit}
            className="cursor-pointer"
          >
            บันทึกคูปอง
          </Button>
        </div>
      </div>
    </div>
  );
};

export { CreateCouponModal, StatCard };
