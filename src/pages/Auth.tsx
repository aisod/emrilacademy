
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

  // Handle email confirmation and authentication state
  useEffect(() => {
    const handleInitialAuth = async () => {
      try {
        // First check if we're already authenticated
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData?.session) {
          console.log("User already has an active session, redirecting to dashboard");
          navigate("/dashboard");
          return;
        }

        // Check URL for auth parameters
        const fragment = window.location.hash;
        const params = new URLSearchParams(fragment.substring(1));
        const accessToken = params.get("access_token") || searchParams.get("access_token");
        const refreshToken = params.get("refresh_token") || searchParams.get("refresh_token");
        const type = params.get("type") || searchParams.get("type");
        const token = params.get("token") || searchParams.get("token");
        
        console.log("Auth: Checking URL parameters:", { accessToken, token, type, refreshToken });
        console.log("Auth: Fragment:", fragment);
        
        // Handle email confirmation flow
        if ((accessToken || token) && (type === "signup" || type === "recovery" || type === "email_change")) {
          console.log("Auth: Processing confirmation flow");
          
          // Try to set the session if we have tokens
          if (accessToken && refreshToken) {
            console.log("Auth: Setting session with tokens");
            try {
              const { error, data } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken,
              });
              
              if (error) {
                console.error("Auth: Error setting session:", error);
                toast({
                  variant: "destructive",
                  title: "Error confirming email",
                  description: error.message,
                });
              } else {
                console.log("Auth: Session set successfully", data);
                
                toast({
                  title: "Email confirmed successfully",
                  description: "Your email has been verified and you're now signed in.",
                });
                
                navigate("/dashboard");
                return;
              }
            } catch (error: any) {
              console.error("Auth: Exception setting session:", error);
            }
          }
          
          // Check for a token that needs verification
          if (token && !accessToken) {
            console.log("Auth: Verifying with token parameter");
            
            try {
              const { error, data } = await supabase.auth.verifyOtp({
                token_hash: token,
                type: type === "signup" ? "signup" : "recovery",
              });
              
              if (error) {
                console.error("Auth: Error verifying OTP:", error);
                toast({
                  variant: "destructive",
                  title: "Error confirming email",
                  description: error.message,
                });
              } else {
                console.log("Auth: OTP verified successfully", data);
                
                toast({
                  title: "Email confirmed successfully",
                  description: "Your email has been verified and you're now signed in.",
                });
                
                if (data.session) {
                  navigate("/dashboard");
                  return;
                }
              }
            } catch (error: any) {
              console.error("Auth: Exception verifying OTP:", error);
            }
          }
          
          // If we got here, show the sign in form
          setSearchParams({ mode: "signin" });
          
          toast({
            title: "Email verified",
            description: "Your email has been verified. Please sign in with your credentials.",
          });
        }
      } catch (error: any) {
        console.error("Auth: Error handling initial auth:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "There was an issue with authentication.",
        });
      }
    };
    
    handleInitialAuth();
  }, [searchParams, toast, navigate, setSearchParams]);

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
