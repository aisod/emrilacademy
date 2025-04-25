
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ProfileFormValues } from "../validation/profileValidation";

interface NameFieldsProps {
  form: UseFormReturn<ProfileFormValues>;
}

export function NameFields({ form }: NameFieldsProps) {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="firstName"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-900 font-semibold">First Name</FormLabel>
            <FormControl>
              <Input
                {...field}
                className="border-2 border-gray-400 focus:border-primary bg-white text-gray-900 shadow-md"
                style={{
                  backgroundColor: "white",
                  color: "#000000"
                }}
              />
            </FormControl>
            <FormMessage className="text-red-600 font-semibold" />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="lastName"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-900 font-semibold">Last Name</FormLabel>
            <FormControl>
              <Input
                {...field}
                className="border-2 border-gray-400 focus:border-primary bg-white text-gray-900 shadow-md"
                style={{
                  backgroundColor: "white",
                  color: "#000000"
                }}
              />
            </FormControl>
            <FormMessage className="text-red-600 font-semibold" />
          </FormItem>
        )}
      />
    </div>
  );
}
