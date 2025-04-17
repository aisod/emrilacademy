
import { useEffect, useState } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignupForm } from "@/components/auth/SignupForm";
import { EmailConfirmation } from "@/components/auth/EmailConfirmation";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const Auth = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const mode = searchParams.get("mode") || "signin";
  const [confirmedEmail, setConfirmedEmail] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const toggleMode = () => {
    setSearchParams({ mode: mode === "signin" ? "signup" : "signin" });
  };

  // Handle email confirmation
  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        // Check for recovery token first (from confirmation email)
        const accessToken = searchParams.get("access_token");
        const type = searchParams.get("type");
        const refreshToken = searchParams.get("refresh_token");
        
        if (accessToken && type === "recovery") {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || "",
          });
          
          if (error) throw error;
          
          toast({
            title: "Email confirmed successfully",
            description: "You can now sign in with your account",
          });
          
          // Clear URL params and redirect to signin
          setSearchParams({ mode: "signin" });
          return;
        }

        // For email confirmation link from Supabase
        if ((accessToken || searchParams.get("token")) && type === "signup") {
          // Email confirmation token exists
          toast({
            title: "Email confirmed successfully",
            description: "Your email has been verified. You can now sign in.",
          });
          
          // Redirect to sign in
          setSearchParams({ mode: "signin" });
        }
      } catch (error: any) {
        console.error("Error confirming email:", error);
        toast({
          variant: "destructive",
          title: "Error confirming email",
          description: error.message || "There was an issue verifying your email. Please try again.",
        });
      }
    };
    
    handleEmailConfirmation();
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
