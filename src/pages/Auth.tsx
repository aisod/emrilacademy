
import { useState } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignupForm } from "@/components/auth/SignupForm";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  const toggleMode = () => setIsSignUp(!isSignUp);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center px-4">
      {isSignUp ? (
        <SignupForm onToggleMode={toggleMode} />
      ) : (
        <LoginForm onToggleMode={toggleMode} />
      )}
    </div>
  );
};

export default Auth;
