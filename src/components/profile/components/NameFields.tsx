
import { UseFormReturn } from "react-hook-form";
import { ProfileFormValues } from "../validation/profileValidation";
import { FormField } from "./FormField";

interface NameFieldsProps {
  form: UseFormReturn<ProfileFormValues>;
}

export function NameFields({ form }: NameFieldsProps) {
  return (
    <div className="space-y-6">
      <FormField
        form={form}
        name="firstName"
        label="First Name"
      />
      
      <FormField
        form={form}
        name="lastName"
        label="Last Name"
      />
    </div>
  );
}
