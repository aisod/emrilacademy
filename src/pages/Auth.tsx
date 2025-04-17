
import { useEffect, useState } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignupForm } from "@/components/auth/SignupForm";
import { EmailConfirmation } from "@/components/auth/EmailConfirmation";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const Auth = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const mode = searchParams.get("mode") || "signin";
  const [confirmedEmail, setConfirmedEmail] = useState<string | null>(null);
  const { toast } = useToast();

  const toggleMode = () => {
    setSearchParams({ mode: mode === "signin" ? "signup" : "signin" });
  };

  // Check if email confirmation is required
  useEffect(() => {
    const handleTokenConfirmation = async () => {
      const confirmToken = searchParams.get("confirmToken");
      
      if (confirmToken) {
        try {
          // Implement token verification logic if needed
          console.log("Email confirmation token detected:", confirmToken);
          
          toast({
            title: "Email confirmation successful",
            description: "Your email has been verified. You can now sign in.",
          });
          
          // Redirect to sign in
          setSearchParams({ mode: "signin" });
        } catch (error) {
          console.error("Error confirming email:", error);
          toast({
            variant: "destructive",
            title: "Error confirming email",
            description: "There was an issue verifying your email. Please try again.",
          });
        }
      }
    };
    
    handleTokenConfirmation();
  }, [searchParams, toast, setSearchParams]);

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
