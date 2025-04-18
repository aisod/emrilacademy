
import { useState } from "react";
import { Mail, AlertCircle, ArrowRight, CheckCircle, Loader, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

interface EmailConfirmationProps {
  email: string;
  userId?: string;
}

export const EmailConfirmation = ({ email }: EmailConfirmationProps) => {
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Handle resend email confirmation
  const handleResendEmail = async () => {
    if (resending || countdown > 0) return;
    
    setResending(true);
    
    try {
      // Get the current URL origin for proper redirects
      const siteUrl = window.location.origin;
      
      console.log("EmailConfirmation: Using site URL:", siteUrl);
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${siteUrl}/auth`
        }
      });
      
      if (error) throw error;
      
      setResent(true);
      setCountdown(60); // 60 second countdown before allowing another resend
      
      toast({
        title: "Confirmation email sent",
        description: "Please check your inbox and spam folder for the confirmation link",
      });
      
      // Start countdown
      const timer = setInterval(() => {
        setCountdown(prevCount => {
          if (prevCount <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prevCount - 1;
        });
      }, 1000);
      
      console.log("Confirmation email resent successfully to:", email);
    } catch (error: any) {
      console.error("Resend error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to resend confirmation email",
      });
    } finally {
      setResending(false);
    }
  };

  // Go to sign in page
  const handleSignInWithPassword = () => {
    navigate("/auth?mode=signin");
  };

  return (
    <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-md">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
          <Mail className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Success! Account Created</h1>
        <p className="text-gray-600">
          Please check your email ({email}) to confirm your account.
        </p>
      </div>

      <div className="bg-blue-50 p-4 rounded-md">
        <div className="flex gap-3">
          <AlertCircle className="h-6 w-6 text-blue-600 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium">You need to verify your email before signing in</p>
            <p className="mt-1">Please check both your inbox and spam folder for the confirmation link</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="text-center">
          <p className="text-sm text-gray-500">Didn't receive an email?</p>
        </div>

        <Button
          onClick={handleResendEmail}
          disabled={resending || countdown > 0}
          variant="outline"
          className="w-full flex gap-2 justify-center items-center border-blue-500 text-blue-600 hover:bg-blue-50"
        >
          {resending ? (
            <>
              <Loader className="h-4 w-4 animate-spin" /> Sending...
            </>
          ) : countdown > 0 ? (
            <>
              <RefreshCw className="h-4 w-4" /> Resend available in {countdown}s
            </>
          ) : resent ? (
            <>
              <CheckCircle className="h-5 w-5" /> Email Sent
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4" /> Resend Confirmation Email
            </>
          )}
        </Button>

        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">or</span>
          </div>
        </div>

        <Button
          onClick={handleSignInWithPassword}
          variant="ghost"
          className="w-full flex gap-2 justify-center items-center"
        >
          Back to Sign In <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
