
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { GraduationCap, BookOpen } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { registerFormSchema } from "@/lib/validation";

type FormValues = z.infer<typeof registerFormSchema>;

interface RoleSelectorProps {
  form: UseFormReturn<FormValues>;
}

export const RoleSelector = ({ form }: RoleSelectorProps) => {
  return (
    <FormField
      control={form.control}
      name="role"
      render={({ field }) => (
        <FormItem className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">I want to</label>
          <FormControl>
            <RadioGroup
              value={field.value}
              onValueChange={field.onChange}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2 p-2 bg-gray-100 rounded-md hover:bg-gray-200">
                <RadioGroupItem value="student" id="student" />
                <Label
                  htmlFor="student"
                  className="flex items-center gap-2 cursor-pointer text-gray-700"
                >
                  <GraduationCap className="h-4 w-4" />
                  <span>Learn as a Student</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-2 bg-gray-100 rounded-md hover:bg-gray-200">
                <RadioGroupItem value="teacher" id="teacher" />
                <Label
                  htmlFor="teacher"
                  className="flex items-center gap-2 cursor-pointer text-gray-700"
                >
                  <BookOpen className="h-4 w-4" />
                  <span>Teach as an Instructor</span>
                </Label>
              </div>
            </RadioGroup>
          </FormControl>
          <FormMessage className="text-sm text-red-500" />
        </FormItem>
      )}
    />
  );
};
