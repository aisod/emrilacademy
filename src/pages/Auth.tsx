
import { useEffect, useState } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignupForm } from "@/components/auth/SignupForm";
import { EmailConfirmation } from "@/components/auth/EmailConfirmation";
import { useSearchParams } from "react-router-dom";

const Auth = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const mode = searchParams.get("mode") || "signin";
  const [confirmedEmail, setConfirmedEmail] = useState<string | null>(null);

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

  // Function to handle successful signup and show email confirmation page
  const handleSignupSuccess = (email: string) => {
    setConfirmedEmail(email);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      {confirmedEmail ? (
        <EmailConfirmation email={confirmedEmail} />
      ) : mode === "signup" ? (
        <SignupForm onToggleMode={toggleMode} onSignupSuccess={handleSignupSuccess} />
      ) : (
        <LoginForm onToggleMode={toggleMode} />
      )}
    </div>
  );
};

export default Auth;
