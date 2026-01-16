import DialogCourse from "./dialog-course";
import CourseList from "./course-list";

const CoursePage = async () => {
  return (
    // Container หลัก: จัดกึ่งกลาง, จำกัดความกว้างสูงสุด, และปรับ Padding ตามขนาดจอ
    <div className="w-full container mx-auto px-4 flex flex-col sm:px-6 lg:px-8 pb-8">
      {/* ส่วน Header: เรียงแนวตั้งบนมือถือ และแนวนอนบนจอ Tablet ขึ้นไป */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        {/* หัวข้อและคำอธิบาย */}
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Course Settings
          </h1>
          <p className="text-sm text-gray-500">
            Manage your course content and structure efficiently.
          </p>
        </div>

        {/* ปุ่ม Action */}
        <div className="flex items-center gap-3">
          {/* ซ่อน text บนมือถือเพื่อให้ประหยัดพื้นที่ หรือจะเก็บไว้ก็ได้ */}
          <span className="hidden md:inline-block text-sm text-gray-400">
            Ready to create new content?
          </span>
          <DialogCourse />
        </div>
      </div>

      {/* ส่วนเนื้อหาหลัก (List): ใส่ Card สีขาว, ขอบมน, และเงาบางๆ */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 w-full h-full">
          <CourseList />
        </div>
      </div>
    </div>
  );
};

export default CoursePage;
