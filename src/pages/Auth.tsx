
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
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const toggleMode = () => {
    setSearchParams({ mode: mode === "signin" ? "signup" : "signin" });
  };

  // Handle email confirmation
  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        // Check URL for auth parameters
        const accessToken = searchParams.get("access_token");
        const type = searchParams.get("type");
        const refreshToken = searchParams.get("refresh_token");
        const token = searchParams.get("token"); // Some URLs use this format
        
        console.log("Auth: Checking URL parameters:", { accessToken, token, type, refreshToken });
        
        // First check if we're already authenticated
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData?.session) {
          console.log("User already has an active session, redirecting to dashboard");
          navigate("/dashboard");
          return;
        }
        
        // Handle password recovery flow
        if (accessToken && type === "recovery") {
          console.log("Auth: Processing password recovery flow");
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

        // Handle email confirmation flow
        if ((accessToken || token) && (type === "signup" || type === "email_change")) {
          console.log("Auth: Processing email confirmation flow");
          
          // First try to set the session if we have tokens
          if (accessToken && refreshToken) {
            console.log("Auth: Setting session with tokens");
            try {
              const { error, data } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken,
              });
              
              if (error) {
                console.error("Auth: Error setting session:", error);
              } else {
                console.log("Auth: Session set successfully", data);
                // If we successfully set the session, redirect to dashboard
                navigate("/dashboard");
                return;
              }
            } catch (error) {
              console.error("Auth: Exception setting session:", error);
            }
          }
          
          // Then check if we have a token that needs verification
          if (token && !accessToken) {
            console.log("Auth: Verifying with token parameter");
            try {
              const { error, data } = await supabase.auth.verifyOtp({
                token_hash: token,
                type: type === "signup" ? "signup" : "email_change",
              });
              
              if (error) {
                console.error("Auth: Error verifying OTP:", error);
                throw error;
              } else {
                console.log("Auth: OTP verified successfully", data);
                // If verification successful and we have a session, redirect to dashboard
                if (data.session) {
                  navigate("/dashboard");
                  return;
                }
              }
            } catch (error) {
              console.error("Auth: Exception verifying OTP:", error);
            }
          }
          
          toast({
            title: "Email confirmed successfully",
            description: "Your email has been verified. You can now sign in.",
          });
          
          // Redirect to sign in
          setSearchParams({ mode: "signin" });
        }
      } catch (error: any) {
        console.error("Auth: Error handling email confirmation:", error);
        toast({
          variant: "destructive",
          title: "Error confirming email",
          description: error.message || "There was an issue verifying your email. Please try again.",
        });
      }
    };
    
    handleEmailConfirmation();
  }, [searchParams, toast, setSearchParams, navigate]);

  // Check if the user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        console.log("User is already authenticated, redirecting to dashboard");
        navigate("/dashboard");
      }
    };
    
    checkAuth();
  }, [navigate]);

  // Function to handle successful signup and show email confirmation page
  const handleSignupSuccess = (email: string, userId?: string) => {
    console.log("Signup success, showing email confirmation for:", email);
    setConfirmedEmail(email);
    if (userId) setUserId(userId);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      {confirmedEmail ? (
        <EmailConfirmation 
          email={confirmedEmail} 
          userId={userId || undefined}
        />
      ) : mode === "signup" ? (
        <SignupForm onToggleMode={toggleMode} onSignupSuccess={handleSignupSuccess} />
      ) : (
        <LoginForm onToggleMode={toggleMode} />
      )}
    </div>
  );
};

export default Auth;
