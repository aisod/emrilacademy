import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { User } from "@supabase/supabase-js";
const profileFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters")
});
type ProfileFormValues = z.infer<typeof profileFormSchema>;
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
  return <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white p-6 space-y-6 shadow-md">
          <FormField control={form.control} name="firstName" render={({
          field
        }) => <FormItem>
                <FormLabel className="text-gray-900 font-semibold">First Name</FormLabel>
                <FormControl>
                  <Input {...field} className="border-2 border-gray-400 focus:border-primary bg-white text-gray-900 shadow-md" style={{
              backgroundColor: "white",
              color: "#000000"
            }} />
                </FormControl>
                <FormMessage className="text-red-600 font-semibold" />
              </FormItem>} />
          
          <FormField control={form.control} name="lastName" render={({
          field
        }) => <FormItem>
                <FormLabel className="text-gray-900 font-semibold">Last Name</FormLabel>
                <FormControl>
                  <Input {...field} className="border-2 border-gray-400 focus:border-primary bg-white text-gray-900 shadow-md" style={{
              backgroundColor: "white",
              color: "#000000"
            }} />
                </FormControl>
                <FormMessage className="text-red-600 font-semibold" />
              </FormItem>} />
        </div>

        <Button type="submit" style={{
        backgroundColor: "#0288D1",
        color: "white",
        fontWeight: 700,
        padding: "0.75rem 1rem",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        border: "2px solid #0288D1"
      }} disabled={form.formState.isSubmitting} className="w-full bg-primary hover:bg-primary/90 font-bold py-3 rounded-md border-2 border-primary shadow-lg text-sky-500">
          {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Form>;
}