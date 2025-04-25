
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { registerFormSchema } from "@/lib/validation";
import { z } from "zod";

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
      // Validate the data with the full schema
      const validationResult = registerFormSchema.safeParse({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role
      });

      if (!validationResult.success) {
        const formattedErrors = validationResult.error.format();
        let errorMessage = "Please fix the following issues:";
        
        // Extract specific error messages
        if (formattedErrors.email?._errors[0]) {
          errorMessage = formattedErrors.email._errors[0];
        } else if (formattedErrors.password?._errors[0]) {
          errorMessage = formattedErrors.password._errors[0];
        } else if (formattedErrors.firstName?._errors[0]) {
          errorMessage = formattedErrors.firstName._errors[0];
        } else if (formattedErrors.lastName?._errors[0]) {
          errorMessage = formattedErrors.lastName._errors[0];
        }
        
        throw new Error(errorMessage);
      }

      // Special handling for teacher emails
      if (data.role === 'teacher' && 
          !data.email.endsWith('@emrilacademy.com') && 
          !data.email.endsWith('@emrilacademy.tech')) {
        throw new Error("Teacher email must end with @emrilacademy.com or @emrilacademy.tech");
      }
      
      // Use absolute URLs for redirects - these must match your Supabase configuration
      const siteUrl = window.location.origin;
      const redirectUrl = `${siteUrl}/auth`;
      
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
      toast({
        title: "Account created",
        description: "Please check your email to confirm your account.",
      });
      
      return { 
        success: true, 
        requiresEmailConfirmation: true, 
        error: null,
        userId: signupData.user?.id || '',
        autoSignedIn: false
      };
    } catch (error: any) {
      console.error("Signup error:", error);
      
      // Improve error messaging
      let errorMessage = error.message;
      if (error.message.includes("User already registered")) {
        errorMessage = "This email is already registered. Please sign in instead.";
      } else if (error.message.includes("unable to validate email")) {
        errorMessage = "Please enter a valid email address.";
      }
      
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return { signup, loading };
};
