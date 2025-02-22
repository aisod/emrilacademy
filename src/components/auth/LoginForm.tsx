
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface LoginFormProps {
  onToggleMode: () => void;
}

export const LoginForm = ({ onToggleMode }: LoginFormProps) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      navigate("/");
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

  return (
    <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-lg">
      <div className="text-center">
        <h2 className="text-3xl font-bold">Welcome Back</h2>
        <p className="mt-2 text-gray-600">Sign in to your account</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white p-3 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
        >
          {loading ? "Processing..." : (
            <>
              Sign In <ArrowRight className="h-5 w-5" />
            </>
          )}
        </button>
      </form>

      <div className="text-center">
        <button
          onClick={onToggleMode}
          className="text-primary hover:text-primary/80 transition-colors"
        >
          Need an account? Sign up
        </button>
      </div>
    </div>
  );
};
