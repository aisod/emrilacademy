
import { useState } from "react";
import { Mail, Lock, User, ArrowRight, GraduationCap, BookOpen, Eye, EyeOff, Loader } from "lucide-react";
import { useSignup } from "@/hooks/useSignup";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface SignupFormProps {
  onToggleMode: () => void;
  onSignupSuccess: (email: string, userId?: string) => void;
}

// Signup form schema with validation
const signupSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  role: z.enum(["student", "teacher"], {
    required_error: "Please select a role",
  })
});

type SignupFormValues = z.infer<typeof signupSchema>;

export const SignupForm = ({ onToggleMode, onSignupSuccess }: SignupFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signup, loading } = useSignup();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "student"
    },
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSignup = async (values: SignupFormValues) => {
    setError(null);
    
    try {
      const result = await signup({ 
        email: values.email, 
        password: values.password, 
        firstName: values.firstName, 
        lastName: values.lastName, 
        role: values.role as "student" | "teacher" 
      });
      
      if (result.success) {
        if (result.requiresEmailConfirmation) {
          onSignupSuccess(values.email, result.userId);
        }
        // User was automatically signed in, no need to show email confirmation
      } else {
        setError(result.error || "Failed to create account");
      }
    } catch (error: any) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Signup error:", error);
    }
  };

  return (
    <div className="w-full max-w-md bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg space-y-6 mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Create Account</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Sign up to start learning</p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded relative">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSignup)} className="space-y-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">First Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5" />
                    <FormControl>
                      <input
                        type="text"
                        className="pl-10 w-full p-3 bg-gray-100 dark:bg-gray-800 border-none rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                        placeholder="Your first name"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage className="text-sm text-red-500" />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Last Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5" />
                    <FormControl>
                      <input
                        type="text"
                        className="pl-10 w-full p-3 bg-gray-100 dark:bg-gray-800 border-none rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                        placeholder="Your last name"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage className="text-sm text-red-500" />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">I want to</label>
                <FormControl>
                  <RadioGroup 
                    value={field.value} 
                    onValueChange={field.onChange} 
                    className="flex flex-col space-y-2"
                  >
                    <div className="flex items-center space-x-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
                      <RadioGroupItem value="student" id="student" />
                      <Label htmlFor="student" className="flex items-center gap-2 cursor-pointer text-gray-700 dark:text-gray-300">
                        <GraduationCap className="h-4 w-4" />
                        <span>Learn as a Student</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
                      <RadioGroupItem value="teacher" id="teacher" />
                      <Label htmlFor="teacher" className="flex items-center gap-2 cursor-pointer text-gray-700 dark:text-gray-300">
                        <BookOpen className="h-4 w-4" />
                        <span>Teach as an Instructor</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage className="text-sm text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5" />
                    <FormControl>
                      <input
                        type="email"
                        className="pl-10 w-full p-3 bg-gray-100 dark:bg-gray-800 border-none rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                        placeholder="Your email address"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage className="text-sm text-red-500" />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5" />
                    <FormControl>
                      <input
                        type={showPassword ? "text" : "password"}
                        className="pl-10 w-full p-3 bg-gray-100 dark:bg-gray-800 border-none rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                        placeholder="Create a secure password"
                        {...field}
                      />
                    </FormControl>
                    <button 
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  <FormMessage className="text-sm text-red-500" />
                </div>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white p-3 rounded-md flex items-center justify-center gap-2 h-auto"
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
          className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors"
        >
          Already have an account? Sign in
        </button>
      </div>
    </div>
  );
};
