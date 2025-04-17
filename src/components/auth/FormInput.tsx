
import { LucideIcon } from "lucide-react";
import { forwardRef } from "react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  icon: LucideIcon;
  error?: string;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ id, label, type = "text", icon: Icon, error, className, ...props }, ref) => {
    // Determine if this is a password field to apply dark styling
    const isPassword = type === "password";
    
    return (
      <div className="space-y-1">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <div className="relative">
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            id={id}
            type={type}
            ref={ref}
            className={`pl-10 w-full p-3 rounded-md focus:ring-2 focus:ring-primary ${
              isPassword 
                ? "bg-gray-800 text-white border-none" 
                : "bg-gray-200/80 border-none focus:bg-gray-100"
            } ${error ? "ring-2 ring-red-500" : ""} ${className || ""}`}
            {...props}
          />
        </div>
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";
