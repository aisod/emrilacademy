
import { useState } from "react";
import { ArrowRight, Loader } from "lucide-react";
import { useSignup } from "@/hooks/useSignup";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { registerFormSchema } from "@/lib/validation";
import { NameFields } from "./form-fields/NameFields";
import { RoleSelector } from "./form-fields/RoleSelector";
import { EmailField } from "./form-fields/EmailField";
import { PasswordField } from "./form-fields/PasswordField";

interface SignupFormProps {
  onToggleMode: () => void;
  onSignupSuccess: (email: string, userId?: string) => void;
}

type SignupFormValues = z.infer<typeof registerFormSchema>;

export const SignupForm = ({ onToggleMode, onSignupSuccess }: SignupFormProps) => {
  const [error, setError] = useState<string | null>(null);
  const { signup, loading } = useSignup();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "student"
    },
    mode: "onChange"
  });

  const handleSignup = async (values: SignupFormValues) => {
    setError(null);
    try {
      const result = await signup({
        email: values.email,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
        role: values.role
      });

      if (result.success) {
        if (result.requiresEmailConfirmation) {
          onSignupSuccess(values.email, result.userId);
        }
      } else {
        setError(result.error || "Failed to create account");
      }
    } catch (error: any) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Signup error:", error);
    }
  };

  return (
    <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg space-y-6 mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800">Create Account</h2>
        <p className="mt-2 text-gray-600">Sign up to start learning</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSignup)} className="space-y-4">
          <NameFields form={form} />
          <RoleSelector form={form} />
          <EmailField form={form} />
          <PasswordField form={form} />

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-white border-primary text-primary hover:bg-primary/10 hover:text-primary-dark flex items-center justify-center gap-2 h-auto"
          >
            {loading ? (
              <>
                <Loader className="h-5 w-5 animate-spin" /> Creating Account...
              </>
            ) : (
              <>
                Create Account <ArrowRight className="h-5 w-5" />
              </>
            )}
          </Button>
        </form>
      </Form>

      <div className="text-center">
        <button
          onClick={onToggleMode}
          className="text-primary hover:text-primary-dark transition-colors"
        >
          Already have an account? Sign in
        </button>
      </div>
    </div>
  );
};
