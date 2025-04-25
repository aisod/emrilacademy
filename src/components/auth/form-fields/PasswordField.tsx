
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { registerFormSchema } from "@/lib/validation";

type FormValues = z.infer<typeof registerFormSchema>;

interface PasswordFieldProps {
  form: UseFormReturn<FormValues>;
}

export const PasswordField = ({ form }: PasswordFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormField
      control={form.control}
      name="password"
      render={({ field }) => (
        <FormItem>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <FormControl>
                <input
                  type={showPassword ? "text" : "password"}
                  className="pl-10 w-full p-3 bg-white border-none rounded-md focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-500"
                  placeholder="Create a secure password"
                  {...field}
                />
              </FormControl>
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            <FormMessage className="text-sm text-red-500" />
          </div>
        </FormItem>
      )}
    />
  );
};
