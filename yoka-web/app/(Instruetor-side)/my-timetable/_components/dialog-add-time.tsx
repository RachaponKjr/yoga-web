"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod"; // เพิ่ม z เข้ามา
import { Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Input from "@/components/ui/input";
import { RoundSchema } from "@/types/round.type";
import { courseService } from "@/service/course.service";
import { useAuthStore } from "@/store/useAuthStore";
import { CourseType } from "@/types/course.type";
import { toast } from "sonner";

type FormValues = z.infer<typeof RoundSchema>;

const DialogAddTime = ({ date }: { date: string }) => {
  const [open, setOpen] = useState(false);
  const { user } = useAuthStore();
  const [courses, setCourses] = useState<CourseType[]>([]);
  console.log(courses, "courses");
  const form = useForm<FormValues>({
    resolver: zodResolver(RoundSchema) as Resolver<FormValues>,
    defaultValues: {
      courseId: "",
      startDateTime: "",
      endDateTime: "",
      max_online: 0,
      max_walk_in: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof RoundSchema>) {
    const startDateTime = new Date(`${date}T${values.startDateTime}`);
    const endDateTime = new Date(`${date}T${values.endDateTime}`);
    if (endDateTime < startDateTime) {
      endDateTime.setDate(endDateTime.getDate() + 1);
    }

    const payload = {
      courseId: values.courseId,
      startDateTime: startDateTime.toISOString(),
      endDateTime: endDateTime.toISOString(),
      max_online: values.max_online,
      max_walk_in: values.max_walk_in,
    };

    const res = await courseService.createRound(payload);
    if (res.success) {
      setOpen(false);
      toast.success("เพิ่มรอบการเรียนสำเร็จ");
      form.reset();
    } else {
      toast.error("เพิ่มรอบการเรียนไม่สำเร็จ");
    }
  }

  const getMyCourse = useCallback(async () => {
    try {
      // เช็คว่ามี user และมี id หรือไม่
      console.log(user, "user");

      if (!user?.id) return;

      const response = await courseService.getMyCourse(user.id, 1);
      setCourses(response.data.courses);
    } catch (error) {
      console.log(error);
    }
  }, [user]);

  useEffect(() => {
    void getMyCourse();
  }, [getMyCourse]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-slate-900 cursor-pointer text-white hover:bg-slate-800 shadow-sm gap-2">
          <Clock className="w-4 h-4" />
          เพิ่มรอบเรียน
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            เพิ่มรอบเวลาเรียน (Add Time)
          </DialogTitle>
          <DialogDescription>
            วันที่: <span className="font-bold text-primary">{date}</span>
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-4"
          >
            {/* --- เลือกคอร์ส --- */}
            <FormField
              control={form.control}
              name="courseId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>คอร์สเรียน</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="เลือกคอร์ส" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {courses?.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.title}
                        </SelectItem>
                      ))}
                      {(!courses || courses.length === 0) && (
                        <div className="p-2 text-sm text-muted-foreground text-center">
                          ไม่พบคอร์สเรียน
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* --- ส่วนเวลา (Time Inputs) --- */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDateTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>เวลาเริ่ม (Start)</FormLabel>
                    <FormControl>
                      {/* ใส่ {...field} ได้เลย ไม่ต้องแปลง format เองแล้ว */}
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDateTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>เวลาเลิก (End)</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="border-t my-2"></div>

            {/* --- ส่วนโควต้า --- */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="max_online"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-500" />
                      Online
                    </FormLabel>
                    <FormControl>
                      <Input type="number" min={0} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="max_walk_in"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-orange-500" />
                      Walk-in
                    </FormLabel>
                    <FormControl>
                      <Input type="number" min={0} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="mt-6 flex flex-col gap-4">
              <Button
                type="submit"
                variant={"outline"}
                className="w-full cursor-pointer bg-slate-900 text-white hover:bg-slate-800"
              >
                บันทึกข้อมูล
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default DialogAddTime;
