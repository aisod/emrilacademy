
import { useState } from "react";
import { Mail, Lock, User, ArrowRight, GraduationCap, BookOpen, Eye, EyeOff } from "lucide-react";
import { useSignup } from "@/hooks/useSignup";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface SignupFormProps {
  onToggleMode: () => void;
  onSignupSuccess: (email: string, userId?: string) => void;
}

export const SignupForm = ({ onToggleMode, onSignupSuccess }: SignupFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("student");
  const [showPassword, setShowPassword] = useState(false);
  const { signup, loading } = useSignup();
  const { toast } = useToast();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName || !lastName || !email || !password) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill in all required fields.",
      });
      return;
    }

    const result = await signup({ 
      email, 
      password, 
      firstName, 
      lastName, 
      role: role as "student" | "teacher" 
    });
    
    if (!result.error) {
      onSignupSuccess(email, result.userId);
    }
  };

  return (
    <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800">Create Account</h2>
        <p className="mt-2 text-gray-600">Sign up to start learning</p>
      </div>

      <form onSubmit={handleSignup} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="pl-10 w-full p-3 bg-gray-100 border-none rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Emmanuel"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="pl-10 w-full p-3 bg-gray-100 border-none rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Asuelime"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">I want to</label>
          <RadioGroup value={role} onValueChange={setRole} className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2 p-2 bg-gray-100 rounded-md hover:bg-gray-200">
              <RadioGroupItem value="student" id="student" />
              <Label htmlFor="student" className="flex items-center gap-2 cursor-pointer text-gray-700">
                <GraduationCap className="h-4 w-4" />
                <span>Learn as a Student</span>
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-2 bg-gray-100 rounded-md hover:bg-gray-200">
              <RadioGroupItem value="teacher" id="teacher" />
              <Label htmlFor="teacher" className="flex items-center gap-2 cursor-pointer text-gray-700">
                <BookOpen className="h-4 w-4" />
                <span>Teach as an Instructor</span>
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 w-full p-3 bg-gray-100 border-none rounded-md focus:ring-2 focus:ring-blue-500"
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
              className="pl-10 w-full p-3 bg-gray-100 border-none rounded-md focus:ring-2 focus:ring-blue-500"
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
          {loading ? "Creating Account..." : (
            <>
              Create Account <ArrowRight className="h-5 w-5" />
            </>
          )}
        </Button>
      </form>

      <div className="text-center">
        <button
          onClick={onToggleMode}
          className="text-blue-500 hover:text-blue-600 transition-colors"
        >
          Already have an account? Sign in
        </button>
      </div>
    </div>
  );
};
