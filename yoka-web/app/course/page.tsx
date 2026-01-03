import { notFound } from "next/navigation";
import CoursePage from "./_components/course-page";
import { courseService } from "@/service/course.service";
import { CourseType, RoundCourseType } from "@/types/course.type";

export interface CourseProps extends CourseType {
  rounds: RoundCourseType[];
}

const page = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const courseId = (await searchParams).courseId;
  const date = (await searchParams).date;
  const { data } = (await courseService.getCourseById(courseId as string)) as {
    data: CourseProps;
  };
  if (!data) {
    return notFound();
  }

  return <CoursePage course={data} date={date} />;
};

export default page;
