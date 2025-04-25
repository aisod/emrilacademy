
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Mail } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { registerFormSchema } from "@/lib/validation";

type FormValues = z.infer<typeof registerFormSchema>;

interface EmailFieldProps {
  form: UseFormReturn<FormValues>;
}

export const EmailField = ({ form }: EmailFieldProps) => {
  const isTeacher = form.watch("role") === "teacher";

  return (
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <FormControl>
                <input
                  type="email"
                  className="pl-10 w-full p-3 bg-white border-none rounded-md focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-500"
                  placeholder={
                    isTeacher
                      ? "Input your email" 
                      : "Input your email"
                  }
                  {...field}
                />
              </FormControl>
            </div>
            <FormMessage className="text-sm text-red-500" />
          </div>
        </FormItem>
      )}
    />
  );
};
