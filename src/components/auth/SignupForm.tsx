
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Lock, User, ArrowRight, GraduationCap, BookOpen } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SignupFormProps {
  onToggleMode: () => void;
}

type UserRole = 'student' | 'teacher';

export const SignupForm = ({ onToggleMode }: SignupFormProps) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState<UserRole>("student");
  const { toast } = useToast();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("Signing up with data:", {
        email,
        firstName,
        lastName,
        role,
      });

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth`,
          data: {
            first_name: firstName,
            last_name: lastName,
            role: role
          },
        },
      });

      console.log("Signup response:", { data, error });

      if (error) throw error;

      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: data.user?.id,
            first_name: firstName,
            last_name: lastName,
            role: role,
          }
        ]);

      if (profileError) {
        console.error("Profile creation error:", profileError);
        throw profileError;
      }

      toast({
        title: "Success!",
        description: "Please check your email to confirm your account.",
      });
    } catch (error: any) {
      console.error("Signup error:", error);
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
        <h2 className="text-3xl font-bold">Create Account</h2>
        <p className="mt-2 text-gray-600">Sign up to start learning</p>
      </div>

      <form onSubmit={handleSignup} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
            First Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              id="firstName"
              type="text"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="pl-10 w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="John"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
            Last Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              id="lastName"
              type="text"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="pl-10 w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Doe"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">
            I want to
          </label>
          <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="student">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  <span>Learn as a Student</span>
                </div>
              </SelectItem>
              <SelectItem value="teacher">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span>Teach as an Instructor</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

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
              Create Account <ArrowRight className="h-5 w-5" />
            </>
          )}
        </button>
      </form>

      <div className="text-center">
        <button
          onClick={onToggleMode}
          className="text-primary hover:text-primary/80 transition-colors"
        >
          Already have an account? Sign in
        </button>
      </div>
    </div>
  );
};
