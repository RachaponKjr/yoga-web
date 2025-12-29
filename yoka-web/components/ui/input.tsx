"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ElementType;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, type = "text", icon: Icon, error, className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    // เช็คว่าเป็น input แบบ password หรือไม่
    const isPasswordType = type === "password";

    return (
      <div className="w-full space-y-2">
        {label && (
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">
            {label}
          </label>
        )}

        <div className="relative group">
          {Icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
              <Icon size={20} />
            </div>
          )}

          <input
            ref={ref}
            type={isPasswordType && showPassword ? "text" : type}
            className={`
              w-full bg-white/50 backdrop-blur-sm
              border-2 rounded-full px-4 py-2 outline-none transition-all duration-200
              placeholder:text-gray-400 text-gray-800
            focus:border-primary/80 focus:ring-primary/10
              ${Icon ? "pl-11" : "pl-4"} 
              ${isPasswordType ? "pr-11" : "pr-4"}
              ${className}
            `}
            {...props}
          />

          {isPasswordType && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors cursor-pointer p-1"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          )}
        </div>

        {error && (
          <p className="text-xs text-destructive font-medium ml-1 animate-pulse">
            *{error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
