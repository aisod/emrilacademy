import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export type UserRole = 'student' | 'teacher';

interface SignupData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

// Define explicit return types for better type safety
interface SignupSuccessWithConfirmation {
  success: true;
  requiresEmailConfirmation: true;
  error: null;
  userId: string;
  autoSignedIn: false;
}

interface SignupSuccessWithAutoSignIn {
  success: true;
  requiresEmailConfirmation: false;
  error: null;
  userId: string;
  autoSignedIn: true;
}

interface SignupError {
  success: false;
  error: any;
}

type SignupResult = SignupSuccessWithConfirmation | SignupSuccessWithAutoSignIn | SignupError;

export const useSignup = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const signup = async (data: SignupData): Promise<SignupResult> => {
    setLoading(true);

    try {
      // Check for required fields
      if (!data.email || !data.password || !data.firstName || !data.lastName) {
        throw new Error("All fields are required");
      }

      // Check password strength (at least 8 characters)
      if (data.password.length < 8) {
        throw new Error("Password must be at least 8 characters long");
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        throw new Error("Please enter a valid email address");
      }

      // Get the current URL origin for proper redirects
      const siteUrl = window.location.origin;
      const redirectUrl = `${siteUrl}/auth?type=signup`;
      
      console.log("Signup: Using site URL:", siteUrl);
      console.log("Signup: Redirect URL set to:", redirectUrl);
      
      // Sign up the user with Supabase - this will send a confirmation email
      const { data: signupData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
            role: data.role
          },
          emailRedirectTo: redirectUrl,
        },
      });

      if (error) throw error;
      
      // Log successful registration
      console.log("Signup successful:", {
        user: signupData.user?.id,
        confirmationSent: !signupData.session,
        hasSession: !!signupData.session
      });
      
      // If we have a session immediately, the user is already confirmed
      if (signupData.session) {
        toast({
          title: "Account created",
          description: "Your account has been created and you're now signed in.",
        });
        
        return { 
          success: true, 
          requiresEmailConfirmation: false, 
          error: null,
          userId: signupData.user?.id || '',
          autoSignedIn: true
        };
      }
      
      // Otherwise, they need email confirmation
      return { 
        success: true, 
        requiresEmailConfirmation: true, 
        error: null,
        userId: signupData.user?.id || '',
        autoSignedIn: false
      };
    } catch (error: any) {
      console.error("Signup error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  return { signup, loading };
};
