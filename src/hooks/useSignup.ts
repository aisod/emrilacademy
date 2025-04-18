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

export const useSignup = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const signup = async (data: SignupData) => {
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
      const redirectTo = `${siteUrl}/auth`;
      
      console.log("Signup: Using site URL:", siteUrl);
      console.log("Signup: Redirect URL set to:", redirectTo);
      
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
          emailRedirectTo: redirectTo,
        },
      });

      if (error) throw error;
      
      // Log successful registration
      console.log("Signup successful:", {
        user: signupData.user?.id,
        confirmationSent: !signupData.session,
        hasSession: !!signupData.session
      });
      
      // Store the credentials securely for later use
      if (!signupData.session) {
        // Only save credentials if we don't have a session yet
        const tempAuthData = {
          email: data.email,
          password: data.password,
          timestamp: Date.now()
        };
        
        // Store in localStorage with expiration
        localStorage.setItem(`temp_auth_${data.email}`, JSON.stringify(tempAuthData));
        
        // Set cleanup timeout
        setTimeout(() => {
          console.log("Removing temporary auth data for security");
          localStorage.removeItem(`temp_auth_${data.email}`);
        }, 10 * 60 * 1000); // 10 minutes
      }
      
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
          userId: signupData.user?.id,
          autoSignedIn: true
        };
      }
      
      // Otherwise, they need email confirmation
      return { 
        success: true, 
        requiresEmailConfirmation: true, 
        error: null,
        userId: signupData.user?.id,
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

  // Method to directly sign in a user after signup
  const signInAfterSignup = async (email: string) => {
    setLoading(true);
    
    try {
      // Attempt to retrieve stored credentials
      const storedAuthDataJson = localStorage.getItem(`temp_auth_${email}`);
      
      if (!storedAuthDataJson) {
        console.error("No stored credentials found for direct sign-in");
        throw new Error("No stored credentials found for sign in");
      }
      
      const storedAuthData = JSON.parse(storedAuthDataJson);
      const now = Date.now();
      
      // Check if stored credentials have expired (more than 10 minutes old)
      if (now - storedAuthData.timestamp > 10 * 60 * 1000) {
        localStorage.removeItem(`temp_auth_${email}`);
        throw new Error("Stored credentials have expired. Please sign in manually.");
      }
      
      console.log("Attempting direct sign-in for:", email);
      
      // Attempt to sign in with stored credentials
      const { data, error } = await supabase.auth.signInWithPassword({
        email: storedAuthData.email,
        password: storedAuthData.password
      });
      
      // Clean up stored credentials regardless of outcome
      localStorage.removeItem(`temp_auth_${email}`);
      
      if (error) {
        console.error("Direct sign-in error:", error);
        throw error;
      }
      
      console.log("Direct sign-in successful:", {
        user: data.user?.id,
        hasSession: !!data.session
      });
      
      toast({
        title: "Signed in successfully",
        description: "You've been signed in and can now use the application.",
      });
      
      return { success: true, error: null, session: data.session };
    } catch (error: any) {
      console.error("Direct sign-in error:", error);
      return { 
        success: false, 
        error: error.message || "Failed to sign in directly"
      };
    } finally {
      setLoading(false);
    }
  };

  return { signup, signInAfterSignup, loading };
};
