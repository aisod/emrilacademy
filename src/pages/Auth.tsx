
import { useEffect } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignupForm } from "@/components/auth/SignupForm";
import { useSearchParams } from "react-router-dom";

const Auth = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const mode = searchParams.get("mode") || "signin";

  const toggleMode = () => {
    setSearchParams({ mode: mode === "signin" ? "signup" : "signin" });
  };

  // Check if email confirmation is required
  useEffect(() => {
    const confirmToken = searchParams.get("confirmToken");
    // Handle email confirmation logic if token exists
    if (confirmToken) {
      // Implement token verification logic if needed
      console.log("Email confirmation token detected");
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      {mode === "signup" ? (
        <SignupForm onToggleMode={toggleMode} />
      ) : (
        <LoginForm onToggleMode={toggleMode} />
      )}
    </div>
  );
};

export default Auth;
