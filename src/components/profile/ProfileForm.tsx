
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import type { User } from "@supabase/supabase-js";
import { profileFormSchema, type ProfileFormValues } from "./validation/profileValidation";
import { NameFields } from "./components/NameFields";
import { FormActions } from "./components/FormActions";
import { useProfileForm } from "./hooks/useProfileForm";

interface ProfileFormProps {
  user: User;
  profile: {
    first_name: string;
    last_name: string;
  };
  onSubmit: (values: ProfileFormValues) => Promise<void>;
}

export function ProfileForm({
  user,
  profile,
  onSubmit
}: ProfileFormProps) {
  const { handleSubmit, defaultValues } = useProfileForm({ user, profile, onSubmit });
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="bg-white p-6 space-y-6 shadow-md">
          <NameFields form={form} />
        </div>
        <FormActions form={form} />
      </form>
    </Form>
  );
}
