
import { useToast } from "@/hooks/use-toast";
import { ProfileFormValues } from "../validation/profileValidation";
import { User } from "@supabase/supabase-js";

interface UseProfileFormProps {
  user: User;
  profile: {
    first_name: string;
    last_name: string;
  };
  onSubmit: (values: ProfileFormValues) => Promise<void>;
}

export function useProfileForm({ profile, onSubmit }: UseProfileFormProps) {
  const { toast } = useToast();

  const handleSubmit = async (values: ProfileFormValues) => {
    try {
      await onSubmit(values);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating profile",
        description: error.message,
      });
    }
  };

  const defaultValues = {
    firstName: profile.first_name || "",
    lastName: profile.last_name || ""
  };

  return {
    handleSubmit,
    defaultValues
  };
}
