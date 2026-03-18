/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCallback, useEffect, useState, useMemo } from "react";
import { courseService } from "@/service/course.service";
import type { Round } from "@/types/round.type";
import { bookingService } from "@/service/booking.service";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  roundId: z.string().min(1, "กรุณาเลือกรอบเรียน"),
  type: z.enum(["ONLINE", "WALK_IN"]),
  price: z.number().min(0),
  note: z.string().optional(),
  quantity: z.number().min(1, "จำนวนต้องอย่างน้อย 1"),
  status: z.enum(["PENDING", "PAID", "CANCELLED"]),
});

const DialogAddBooking = () => {
  const [rounds, setRounds] = useState<Round[]>([]);
  const [open, setOpen] = useState(false); // ควบคุมการปิด Dialog

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roundId: "",
      quantity: 1,
      price: 0,
      type: "ONLINE",
      note: "",
      status: "PENDING",
    },
  });

  const watchRoundId = form.watch("roundId");
  const watchQuantity = form.watch("quantity");
  // --- ส่วนคำนวณ VAT 7% ---
  const priceStats = useMemo(() => {
    const selectedRound = rounds.find((r) => r.id === watchRoundId);
    const basePricePerUnit = selectedRound?.course?.price || 0;
    const subtotal = basePricePerUnit * watchQuantity;
    const vat = subtotal * 0.07;
    const total = subtotal + vat;

    return { subtotal, vat, total };
  }, [watchRoundId, watchQuantity, rounds]);

  // อัปเดตราคาใน Form เมื่อมีการคำนวณใหม่ (ใช้ Grand Total)
  useEffect(() => {
    form.setValue("price", priceStats.total);
  }, [priceStats.total]);

  const getRound = useCallback(async () => {
    try {
      const now = new Date();
      const startOfToday = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
      );
      const month = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, "0")}`;
      const res = await courseService.getRoundToDay({ month });

      const filteredAndSorted = res.data
        .filter((item: any) => new Date(item.startDateTime) >= startOfToday)
        .sort(
          (a: any, b: any) =>
            new Date(a.startDateTime).getTime() -
            new Date(b.startDateTime).getTime(),
        );

      setRounds(filteredAndSorted);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    void getRound();
  }, [getRound]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await bookingService
      .createBooking(values)
      .then((res) => {
        console.log(res);
        toast.success("เพิ่มการจองสำเร็จ");
        setOpen(false);
        form.reset();
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 px-4 py-2 cursor-pointer bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200">
          + เพิ่มการจอง
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>เพิ่มการจองใหม่</DialogTitle>
          <DialogDescription>
            คำนวณราคาพร้อมภาษีมูลค่าเพิ่ม 7%
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="roundId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>เลือกรอบการเรียน</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-auto w-full py-2">
                        <SelectValue placeholder="ค้นหา..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {rounds.map((item) => (
                        <SelectItem key={item.id} value={item.id as string}>
                          <div className="flex flex-col items-start">
                            <span className="font-bold text-indigo-700">
                              {item.course?.title}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              {format(
                                new Date(item.startDateTime),
                                "dd/MM/yy HH:mm",
                              )}{" "}
                              น.
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>จำนวนคน</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ประเภท</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ONLINE">Online</SelectItem>
                        <SelectItem value="WALK_IN">Walk-in</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>

            {/* ส่วนแสดงการคำนวณราคาแยก Vat */}
            <div className="bg-slate-50 p-4 rounded-xl space-y-2 border border-slate-100">
              <div className="flex justify-between text-sm text-slate-600">
                <span>ราคาก่อนภาษี (Subtotal):</span>
                <span>{priceStats.subtotal.toLocaleString()} ฿</span>
              </div>
              <div className="flex justify-between text-sm text-slate-600">
                <span>ภาษีมูลค่าเพิ่ม (VAT 7%):</span>
                <span>
                  {priceStats.vat.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  ฿
                </span>
              </div>
              <div className="flex justify-between font-bold text-indigo-600 border-t pt-2 mt-1">
                <span>ราคาสุทธิ (Grand Total):</span>
                <span>
                  {priceStats.total.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}{" "}
                  ฿
                </span>
              </div>
            </div>

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>สถานะการชำระเงิน</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="PENDING">รอดำเนินการ</SelectItem>
                      <SelectItem value="PAID">ชำระแล้ว</SelectItem>
                      <SelectItem value="CANCELLED">ยกเลิก</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>หมายเหตุ</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="" />
                  </FormControl>
                  <FormDescription>
                    ชื่อลูกค้า - ช่องทางติดต่อ หรือ ข้อมูลอื่นๆ (ถ้ามี)
                  </FormDescription>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-indigo-600 py-6 text-lg font-bold"
            >
              ยืนยันการจอง {priceStats.total.toLocaleString()} ฿
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default DialogAddBooking;
