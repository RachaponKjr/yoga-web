import CourseBox from "./course-box";

const ProductCourse = () => {
  return (
    <div className="md:pt-12 pt-0 px-4 md:px-0 pb-16 md:pb-24 bg-[#f8f7f3]">
      <div className="container mx-auto flex flex-col justify-between gap-6 items-center w-full z-10">
        <div className="flex flex-col justify-center items-center gap-2 w-full">
          <div className="border border-[#c3ccb2] rounded-full p-2">
            <div className="w-3 aspect-square rounded-full bg-[#8c9778]"></div>
          </div>
          <div className="w-px h-4 bg-[#c3ccb2]" />
        </div>
        <div className="flex flex-col items-center text-[#30372c] justify-center gap-8 w-full">
          <div className="flex flex-col items-center gap-2 max-w-4xl w-full">
            <span className="text-2xl md:text-4xl font-serif font-normal tracking-[-0.025em]  text-center">
              Yoga Memberships & Class Passes
            </span>
            <p className="text-[#73766b] text-sm md:text-base leading-[1.9] text-center">
              Choose the plan that fits your lifestyle. From single drop-in
              classes to unlimited monthly memberships, we offer flexible
              options to support your journey on the mat.
            </p>
          </div>
          <CourseBox />
        </div>
      </div>
    </div>
  );
};

export default ProductCourse;
