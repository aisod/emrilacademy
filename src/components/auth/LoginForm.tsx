
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { useLogin } from "@/hooks/useLogin";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { EmailField } from "./form-fields/EmailField";

interface LoginFormProps {
  onToggleMode: () => void;
}

// Simple login schema that doesn't enforce domain restrictions
const loginFormSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }).email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Password is required" })
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export const LoginForm = ({
  onToggleMode
}: LoginFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login, loading } = useLogin();
  const { toast } = useToast();
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const handleLogin = async (values: LoginFormValues) => {
    setError(null);
    try {
      // Trim values to remove any whitespace
      const trimmedEmail = values.email.trim();
      const trimmedPassword = values.password.trim();
      
      console.log("Attempting login with:", trimmedEmail);
      
      const result = await login(trimmedEmail, trimmedPassword);
      if (!result.success) {
        setError(result.error || "Failed to sign in");
        toast({
          variant: "destructive",
          title: "Sign in failed",
          description: result.error || "Please check your credentials and try again.",
        });
      }
    } catch (error: any) {
      const errorMessage = error.message || "An unexpected error occurred. Please try again.";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Sign in failed",
        description: errorMessage,
      });
      console.error("Login error:", error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg space-y-6 mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
        <p className="mt-2 text-gray-600">Sign in to your account</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="Your email address" 
                        {...field}
                        className="pl-10"
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
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <FormControl>
                      <Input 
                        type={showPassword ? "text" : "password"} 
                        className="pl-10"
                        placeholder="Your password" 
                        {...field} 
                      />
                    </FormControl>
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
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
            variant="default" 
            disabled={loading} 
            className="w-full flex items-center justify-center gap-2 h-auto bg-blue-600 hover:bg-blue-700 text-white py-2"
          >
            {loading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent"></div> Signing In...
              </>
            ) : (
              <>
                Sign In <LogIn className="h-5 w-5" />
              </>
            )}
          </Button>
        </form>
      </Form>

      <div className="text-center">
        <button 
          onClick={onToggleMode} 
          className="text-blue-600 hover:text-blue-800 transition-colors"
        >
          Need an account? Sign up
        </button>
      </div>
    </div>
  );
};
