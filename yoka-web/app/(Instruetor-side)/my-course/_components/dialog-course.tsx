"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import MultiImageUpload, {
  UploadableFile,
} from "@/components/MultiImageUpload";
import { useAuthStore } from "@/store/useAuthStore";
import { courseService } from "@/service/course.service";
import { toast } from "sonner";
import { Icon } from "@iconify/react";
import { Textarea } from "@/components/ui/textarea";
import { useCourseStore } from "@/store/useCourse";

interface Course {
  title: string | null;
  description: string | null;
  about: string | null;
  price: number;
  discount_price: number;
}

const DialogCourse = () => {
  const { user } = useAuthStore();
  const { courses, getCourses, isLoading } = useCourseStore();
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState<UploadableFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState<Course>({
    title: null,
    description: null,
    price: 0,
    discount_price: 0,
    about: null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCourse((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      if (!course.title || !course.description || !course.about) {
        toast.error("Please fill in all fields");
        return;
      }
      formData.append("title", course.title);
      formData.append("description", course.description);
      formData.append("about", course.about);
      formData.append("price", course.price.toString());
      formData.append("discount_price", course.discount_price.toString());
      formData.append("teacherId", user?.id || "");
      if (images.length !== 0) {
        formData.append("course_poster", images[0]);
        images.slice(1).forEach((image) => {
          formData.append("image_course", image);
        });
      }
      const res = await courseService.createCourse(formData);
      if (res.success) {
        toast.success("Create course successfully");
        setOpen(false);
        await getCourses({ userId: user?.id || "" });
        return;
      }
      toast.error(res.message);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button className="rounded-full px-6 bg-primary text-white cursor-pointer">
          เพิ่มคอร์ส
        </Button>
      </DialogTrigger>
      <DialogContent className="md:max-w-2xl! max-h-[calc(100vh-15rem)]! overflow-hidden overflow-y-scroll!">
        <DialogHeader>
          <DialogTitle>Are you create course?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="grid grid-cols-2 gap-4">
          <div className="flex flex-col col-span-2 gap-2">
            <label className="text-sm text-[#666666] font-medium">
              Course Name
            </label>
            <Input
              placeholder="Course Name"
              name="title"
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col col-span-2 gap-2">
            <label className="text-sm text-[#666666] font-medium">
              Course Description
            </label>
            <Textarea
              placeholder="Course Description"
              name="description"
              onChange={(e) => {
                setCourse((prev) => ({
                  ...prev,
                  description: e.target.value,
                }));
              }}
            />
          </div>
          <div className="flex flex-col gap-2 col-span-2 ">
            <label className="text-sm text-[#666666] font-medium">About</label>
            <Textarea
              placeholder="About"
              name="about"
              onChange={(e) => {
                setCourse((prev) => ({
                  ...prev,
                  about: e.target.value,
                }));
              }}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-[#666666] font-medium">Price</label>
            <Input
              placeholder="Price"
              type="number"
              min={0}
              defaultValue={0}
              name="price"
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-[#666666] font-medium">
              Discount Price
            </label>
            <Input
              placeholder="Discount Price"
              type="number"
              min={0}
              defaultValue={0}
              name="discount_price"
              onChange={handleChange}
            />
          </div>
          <div className="col-span-2 flex flex-col gap-2">
            <label className="text-sm text-[#666666] font-medium">
              Course Image (Max 5) <span className="text-red-500">*</span>
            </label>
            <span className="text-xs text-[#666666]">
              First Image will be cover image
            </span>
            <MultiImageUpload maxFiles={5} onFilesChange={setImages} />
          </div>
          <Button
            onClick={(e) => {
              e.preventDefault();
              setOpen(false);
            }}
            className="px-6 bg-white text-primary cursor-pointer"
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            className="px-6 bg-primary text-white cursor-pointer"
            type="submit"
          >
            {loading ? <Icon icon="eos-icons:loading" /> : "Create"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DialogCourse;
