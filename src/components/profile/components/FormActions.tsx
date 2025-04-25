
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { ProfileFormValues } from "../validation/profileValidation";

interface FormActionsProps {
  form: UseFormReturn<ProfileFormValues>;
}

export function FormActions({ form }: FormActionsProps) {
  return (
    <Button 
      type="submit" 
      disabled={form.formState.isSubmitting} 
      className="w-full text-primary hover:text-primary-dark font-bold py-3 rounded-md border-2 border-primary shadow-lg"
    >
      {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
    </Button>
  );
}
