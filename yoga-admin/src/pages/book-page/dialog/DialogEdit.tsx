import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { courseService } from "@/service/course.service";
import {
  type BookingType,
  type CourseType,
  type RoundType,
} from "@/types/booking.type";
import { Edit, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

import { format } from "date-fns";
import { th } from "date-fns/locale";
import { bookingService } from "@/service/booking.service";
import { toast } from "sonner";

export interface PayloadProps {
  status: string;
  roundId: string;
  price: number;
  description: string;
}

const DialogEdit = ({
  booking,
  onComplete,
}: {
  booking: BookingType;
  onComplete: () => void;
}) => {
  const [course, setCourse] = useState<CourseType[]>([]);
  const [round, setRound] = useState<RoundType[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [payload, setPayload] = useState<PayloadProps>({
    status: booking.status,
    roundId: booking.round.id,
    price: booking.price,
    description: booking.description || "",
  });

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await bookingService.updateBookingService(
        booking.id,
        payload
      );
      if (response.success) {
        toast.success("อัปเดตข้อมูลสำเร็จ");
        setOpen(false);
        onComplete();
      } else {
        toast.error("อัปเดตข้อมูลไม่สำเร็จ");
      }
    } catch (error) {
      console.error(error);
      toast.error("อัปเดตข้อมูลไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchCourse = async () => {
      const response = await courseService.getCourseAll();
      setCourse(response.data.courses);
    };
    const fetchRound = async () => {
      const response = await courseService.getAll();
      if (response.data.courses) {
        const rounds = response.data.courses;
        const filteredRounds = rounds.filter(
          (round: RoundType) => round.courseId === booking.round.courseId
        );
        setRound(filteredRounds);
      }
    };
    fetchCourse();
    fetchRound();
  }, [booking]);

  if (!course) return null;
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <button
          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          title="แก้ไข"
        >
          <Edit size={18} />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl!">
        <DialogHeader>
          <DialogTitle>แก้ไข</DialogTitle>
          <DialogDescription>
            แก้ไขข้อมูลการจอง (รหัสการจอง : {booking.id})
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">
              ชื่อผู้จอง
            </label>
            <Input
              disabled
              type="text"
              id="name"
              value={
                booking.student.userInfo.firstName +
                " " +
                booking.student.userInfo.lastName
              }
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="phone"
              className="text-sm font-medium text-gray-700"
            >
              เบอร์โทรศัพท์
            </label>
            <Input
              disabled
              type="text"
              id="phone"
              value={String(booking.student.userInfo.phone_number)}
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              อีเมล
            </label>
            <Input
              disabled
              type="email"
              id="email"
              value={booking.student.email}
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              สถานะการจอง
            </label>
            <Select
              value={payload.status}
              defaultValue={payload.status}
              onValueChange={(value) =>
                setPayload({
                  ...payload,
                  status: String(value) as "PENDING" | "PAID" | "CANCELLED",
                })
              }
            >
              <SelectTrigger className="w-full bg-white!">
                <SelectValue placeholder="สถานะการจอง" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING">รอการชำระเงิน</SelectItem>
                <SelectItem value="PAID">ชำระเงินแล้ว</SelectItem>
                <SelectItem value="CANCELLED">ยกเลิก</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 col-span-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              คอร์สเรียน/รอบที่เรียน
            </label>
            <Select
              value={payload.roundId}
              defaultValue={payload.roundId}
              onValueChange={(value) =>
                setPayload({
                  ...payload,
                  roundId: String(value),
                })
              }
            >
              <SelectTrigger className="w-full bg-white!">
                <SelectValue placeholder="รอบที่เรียน" />
              </SelectTrigger>
              <SelectContent>
                {round.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.course.title +
                      " วันที่ " +
                      format(item.startDateTime, "d MMMM yyyy", {
                        locale: th,
                      })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label
              htmlFor="price"
              className="text-sm font-medium text-gray-700"
            >
              ราคา
            </label>
            <Input
              value={payload.price.toFixed(2)}
              type="text"
              id="price"
              onChange={(e) =>
                setPayload({ ...payload, price: Number(e.target.value) })
              }
            />
          </div>
          <div className="space-y-2 flex flex-col col-span-2">
            <label
              htmlFor="description"
              className="text-sm font-medium text-gray-700"
            >
              คำอธิบาย
            </label>
            <textarea
              value={payload.description}
              id="description"
              onChange={(e) =>
                setPayload({ ...payload, description: e.target.value })
              }
              className="w-full border border-gray-300 rounded-md p-2 overscroll-y-auto"
            ></textarea>
          </div>
        </div>
        <DialogFooter>
          <DialogClose>
            <Button variant="outline" size={"lg"} className="cursor-pointer">
              ยกเลิก
            </Button>
          </DialogClose>
          <Button
            size={loading ? "icon-lg" : "lg"}
            onClick={handleSubmit}
            className="bg-primary! cursor-pointer"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "อัปเดต"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogEdit;
