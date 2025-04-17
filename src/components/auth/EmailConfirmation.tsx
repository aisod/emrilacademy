
import { useState } from "react";
import { Mail, AlertCircle, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface EmailConfirmationProps {
  email: string;
}

export const EmailConfirmation = ({ email }: EmailConfirmationProps) => {
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const { toast } = useToast();

  const handleResendEmail = async () => {
    if (resending) return;
    
    setResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });
      
      if (error) throw error;
      
      setResent(true);
      toast({
        title: "Confirmation email sent",
        description: "Please check your inbox for the confirmation link",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to resend confirmation email",
      });
    } finally {
      setResending(false);
    }
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
            <p className="mt-1">Please check your inbox and spam folder for the confirmation link</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="text-center">
          <p className="text-sm text-gray-500">Didn't receive an email?</p>
        </div>

        <Button
          onClick={handleResendEmail}
          disabled={resending || resent}
          variant="outline"
          className="w-full flex gap-2 justify-center items-center border-blue-500 text-blue-600 hover:bg-blue-50"
        >
          {resending ? (
            "Sending..."
          ) : resent ? (
            <>
              <CheckCircle className="h-5 w-5" /> Email Sent
            </>
          ) : (
            "Resend Confirmation Email"
          )}
        </Button>

        <Button
          onClick={() => window.location.href = "/auth?mode=signin"}
          variant="ghost"
          className="w-full flex gap-2 justify-center items-center"
        >
          Back to Sign In <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
