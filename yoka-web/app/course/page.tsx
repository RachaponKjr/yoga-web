import type { Metadata } from "next";
import { cache } from "react";
import axios from "axios";
import { pageMetadata } from "@/lib/seo";
import { imageUrl } from "@/lib/image-url";
import { notFound } from "next/navigation";
import CoursePage from "./_components/course-page";
import { courseService } from "@/service/course.service";
import { CourseType, RoundCourseType } from "@/types/course.type";
import { UserInfoType } from "@/types/auth.type";

interface TeacherType extends UserInfoType {
  userInfo: {
    avatar: string | null;
    experience: string | null;
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
    sex: string | null;
  };
}

export interface CourseProps extends CourseType {
  rounds: RoundCourseType[];
  teacher: TeacherType;
}

type CoursePageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const getCourse = cache(async (courseId: string): Promise<CourseProps> => {
  try {
    const { data } = await courseService.getCourseById(courseId);
    if (!data) notFound();
    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) notFound();
    throw error;
  }
});

export async function generateMetadata({
  searchParams,
}: CoursePageProps): Promise<Metadata> {
  const { courseId } = await searchParams;
  if (typeof courseId !== "string" || !courseId) notFound();
  const course = await getCourse(courseId);
  return pageMetadata({
    title: course.title,
    description: (
      course.description ||
      course.about ||
      `Explore ${course.title} at Yoga By Niti in Rawai, Phuket. View class details and book your next session.`
    )
      .replace(/\s+/g, " ")
      .slice(0, 160),
    path: `/course?courseId=${encodeURIComponent(courseId)}`,
    image: imageUrl(course.cover_image) || undefined,
    noIndex: course.isShow === false || course.status !== "Open",
  });
}

export default async function CourseRoute({ searchParams }: CoursePageProps) {
  const { courseId, date } = await searchParams;
  if (typeof courseId !== "string" || !courseId) notFound();
  const course = await getCourse(courseId);
  return (
    <CoursePage course={course} date={typeof date === "string" ? date : ""} />
  );
}
