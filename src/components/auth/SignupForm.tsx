
import { useState } from "react";
import { Mail, Lock, User, ArrowRight } from "lucide-react";
import { FormInput } from "./FormInput";
import { RoleSelect } from "./RoleSelect";
import { useSignup } from "@/hooks/useSignup";

interface SignupFormProps {
  onToggleMode: () => void;
}

export const SignupForm = ({ onToggleMode }: SignupFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("student");
  const { signup, loading } = useSignup();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    await signup({ email, password, firstName, lastName, role: role as "student" | "teacher" });
  };

  return (
    <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-lg">
      <div className="text-center">
        <h2 className="text-3xl font-bold">Create Account</h2>
        <p className="mt-2 text-gray-600">Sign up to start learning</p>
      </div>

      <form onSubmit={handleSignup} className="space-y-6">
        <FormInput
          id="firstName"
          label="First Name"
          type="text"
          value={firstName}
          onChange={setFirstName}
          placeholder="John"
          Icon={User}
        />

        <FormInput
          id="lastName"
          label="Last Name"
          type="text"
          value={lastName}
          onChange={setLastName}
          placeholder="Doe"
          Icon={User}
        />

        <RoleSelect value={role as "student" | "teacher"} onValueChange={setRole} />

        <FormInput
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="you@example.com"
          Icon={Mail}
        />

        <FormInput
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="••••••••"
          Icon={Lock}
        />

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
