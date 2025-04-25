
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { User } from "@supabase/supabase-js";
import { profileFormSchema, type ProfileFormValues } from "./validation/profileValidation";
import { NameFields } from "./components/NameFields";

interface ProfileFormProps {
  user: User;
  profile: {
    first_name: string;
    last_name: string;
  };
  onSubmit: (values: ProfileFormValues) => Promise<void>;
}

export function ProfileForm({
  profile,
  onSubmit
}: ProfileFormProps) {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: profile.first_name || "",
      lastName: profile.last_name || ""
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white p-6 space-y-6 shadow-md">
          <NameFields form={form} />
        </div>

        <Button 
          type="submit" 
          disabled={form.formState.isSubmitting} 
          className="w-full text-primary hover:text-primary-dark font-bold py-3 rounded-md border-2 border-primary shadow-lg"
        >
          {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
}
