
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/auth/FormInput";

interface LoginFormProps {
  onToggleMode: () => void;
}

export const LoginForm = ({ onToggleMode }: LoginFormProps) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) throw signInError;

      // Get the user's role from profiles table
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session after login");

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .maybeSingle();

      if (profileError) throw profileError;

      // Show success message
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });

      // Redirect based on role
      if (profile?.role === 'teacher') {
        navigate('/teacher');
      } else if (profile?.role === 'student') {
        navigate('/student');
      } else {
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-800">Welcome Back</h2>
        <p className="mt-2 text-gray-600">Sign in to your account</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 w-full p-3 bg-gray-100 border-none rounded-md focus:ring-2 focus:ring-primary focus:bg-gray-100"
              placeholder="youremail@example.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 w-full p-3 bg-gray-100 border-none rounded-md focus:ring-2 focus:ring-primary"
              placeholder="••••••••"
            />
            <button 
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-md flex items-center justify-center gap-2 h-auto"
        >
          {loading ? "Signing In..." : (
            <>
              Sign In <ArrowRight className="h-5 w-5" />
            </>
          )}
        </Button>
      </form>

      <div className="text-center">
        <button
          onClick={onToggleMode}
          className="text-blue-500 hover:text-blue-600 transition-colors"
        >
          Need an account? Sign up
        </button>
      </div>
    </div>
  );
};
