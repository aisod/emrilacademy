
import { FormControl, FormField as Form, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface FormFieldProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
}

export function FormField({ form, name, label }: FormFieldProps) {
  return (
    <Form
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-gray-900 font-semibold">{label}</FormLabel>
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
  );
}
