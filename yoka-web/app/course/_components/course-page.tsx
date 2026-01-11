import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import CourseDetailPage from "./yoga-course-detail";
import { CourseProps } from "../page";

const CoursePage = ({
  course,
  date,
}: {
  course: CourseProps;
  date: Date | string;
}) => {
  return (
    <div className="flex flex-col gap-6">
      <CourseDetailPage course={course} date={date} />
    </div>
  );
};

export default CoursePage;
