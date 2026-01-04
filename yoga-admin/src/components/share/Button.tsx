import React, { forwardRef, type ButtonHTMLAttributes } from "react";

// 1. กำหนด Type ของ Props
// เรา Extends จากปุ่มปกติของ HTML เพื่อให้รับ onClick, type, disabled ฯลฯ ได้ครบ
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "full";
  isLoading?: boolean;
}

// 2. สร้าง Component และใช้ forwardRef (เผื่อต้องใช้ ref ในอนาคต)
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      variant = "primary",
      size = "md",
      isLoading = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    // --- Styles Configuration ---

    // Base Styles: สไตล์พื้นฐานที่ทุกปุ่มต้องมี
    const baseStyles =
      "inline-flex cursor-pointer items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:pointer-events-none disabled:opacity-50";

    // Variants: สีและสไตล์ต่างๆ
    const variants = {
      primary: "bg-indigo-600! text-white hover:bg-indigo-700 shadow-sm",
      secondary:
        "bg-white text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50",
      outline:
        "border border-indigo-600 text-indigo-600 bg-transparent hover:bg-indigo-50",
      ghost: "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
      danger: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
    };

    // Sizes: ขนาดปุ่ม
    const sizes = {
      sm: "h-8 px-3 text-xs",
      md: "h-10 px-4 py-2 text-sm",
      lg: "h-12 px-8 text-base",
      full: "h-10 w-full px-4 py-2 text-sm", // เต็มความกว้าง
    };

    // รวม Class ทั้งหมด (ใช้ Template Literals ง่ายๆ ไม่ต้องลง library)
    const combinedClassName = `
      ${baseStyles} 
      ${variants[variant]} 
      ${sizes[size]} 
      ${className}
    `.trim();

    return (
      <button
        ref={ref}
        className={combinedClassName}
        disabled={isLoading || disabled} // ถ้าโหลดอยู่ ให้ disable อัตโนมัติ
        {...props}
      >
        {isLoading && (
          // Loading Spinner Icon
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {children}
      </button>
    );
  }
);

// ตั้งชื่อ DisplayName ให้ Component (ดีต่อการ Debug)
Button.displayName = "Button";

export default Button;
