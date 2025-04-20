
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const passwordFormSchema = z.object({
  currentPassword: z.string().min(6, "Password must be at least 6 characters"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordFormSchema>;

interface PasswordFormProps {
  onSubmit: (values: PasswordFormValues) => Promise<void>;
}

export function PasswordForm({ onSubmit }: PasswordFormProps) {
  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  return (
    <Card className="border border-gray-300 bg-white shadow-md">
      <CardHeader className="bg-white border-b border-gray-300 pb-4">
        <CardTitle className="text-gray-800 font-medium">Change Password</CardTitle>
      </CardHeader>
      <CardContent className="bg-white pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-800 font-medium">Current Password</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      {...field} 
                      className="border-gray-300 bg-white text-gray-800 shadow-sm" 
                    />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-800 font-medium">New Password</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      {...field} 
                      className="border-gray-300 bg-white text-gray-800 shadow-sm" 
                    />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-800 font-medium">Confirm New Password</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      {...field} 
                      className="border-gray-300 bg-white text-gray-800 shadow-sm" 
                    />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90 text-white font-medium" 
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
