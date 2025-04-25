
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { User } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { registerFormSchema } from "@/lib/validation";

type FormValues = z.infer<typeof registerFormSchema>;

interface NameFieldsProps {
  form: UseFormReturn<FormValues>;
}

export const NameFields = ({ form }: NameFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="firstName"
        render={({ field }) => (
          <FormItem>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <FormControl>
                  <input
                    type="text"
                    placeholder="Your first name"
                    className="pl-10 w-full p-3 bg-white border-none rounded-md focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-500"
                    {...field}
                  />
                </FormControl>
              </div>
              <FormMessage className="text-sm text-red-500" />
            </div>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="lastName"
        render={({ field }) => (
          <FormItem>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <FormControl>
                  <input
                    type="text"
                    className="pl-10 w-full p-3 bg-white border-none rounded-md focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-500"
                    placeholder="Your last name"
                    {...field}
                  />
                </FormControl>
              </div>
              <FormMessage className="text-sm text-red-500" />
            </div>
          </FormItem>
        )}
      />
    </>
  );
};
