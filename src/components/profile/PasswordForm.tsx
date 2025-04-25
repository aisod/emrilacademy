import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
const passwordFormSchema = z.object({
  currentPassword: z.string().min(6, "Password must be at least 6 characters"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters")
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});
type PasswordFormValues = z.infer<typeof passwordFormSchema>;
interface PasswordFormProps {
  onSubmit: (values: PasswordFormValues) => Promise<void>;
}
export function PasswordForm({
  onSubmit
}: PasswordFormProps) {
  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    }
  });
  return <Card className="border-0 bg-white shadow-none">
      <CardHeader className="bg-white border-b-2 border-gray-400 pb-4">
        <CardTitle className="text-gray-900 font-bold">Change Password</CardTitle>
      </CardHeader>
      <CardContent className="bg-white pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField control={form.control} name="currentPassword" render={({
            field
          }) => <FormItem>
                  <FormLabel className="text-gray-900 font-semibold">Current Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} className="border-2 border-gray-400 bg-white text-gray-900 shadow-md" style={{
                backgroundColor: "white",
                color: "#000000"
              }} />
                  </FormControl>
                  <FormMessage className="text-red-600 font-semibold" />
                </FormItem>} />
            
            <FormField control={form.control} name="newPassword" render={({
            field
          }) => <FormItem>
                  <FormLabel className="text-gray-900 font-semibold">New Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} className="border-2 border-gray-400 bg-white text-gray-900 shadow-md" style={{
                backgroundColor: "white",
                color: "#000000"
              }} />
                  </FormControl>
                  <FormMessage className="text-red-600 font-semibold" />
                </FormItem>} />
            
            <FormField control={form.control} name="confirmPassword" render={({
            field
          }) => <FormItem>
                  <FormLabel className="text-gray-900 font-semibold">Confirm New Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} className="border-2 border-gray-400 bg-white text-gray-900 shadow-md" style={{
                backgroundColor: "white",
                color: "#000000"
              }} />
                  </FormControl>
                  <FormMessage className="text-red-600 font-semibold" />
                </FormItem>} />

            <Button type="submit" style={{
            backgroundColor: "#0288D1",
            color: "white",
            fontWeight: 700,
            padding: "0.75rem 1rem",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            border: "2px solid #0288D1"
          }} disabled={form.formState.isSubmitting} className="w-full bg-primary hover:bg-primary/90 font-bold py-3 rounded-md border-2 border-primary shadow-lg text-primary-DEFAULT">
              {form.formState.isSubmitting ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>;
}