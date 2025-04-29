
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

export interface LoginResult {
  success: boolean;
  error?: string | null;
  session?: any;
}

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();

  const login = useCallback(async (email: string, password: string): Promise<LoginResult> => {
    if (loginAttempts >= 5) {
      toast({
        variant: "destructive",
        title: "Too many attempts",
        description: "Please try again later or reset your password",
      });
      return { success: false, error: "Too many login attempts" };
    }
    
    setLoading(true);
    
    try {
      // Validate inputs
      if (!email) {
        throw new Error("Email is required");
      }
      
      if (!password) {
        throw new Error("Password is required");
      }
      
      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error("Please enter a valid email address");
      }
      
      console.log("Attempting login for:", email);
      
      // Special case for admin - hardcoded credentials matching
      // Make email check case-insensitive
      if (email.toLowerCase() === "admin@emrilacademy.tech" && password === "1Joel100%") {
        console.log("Admin login detected, bypassing Supabase auth");
        
        // Create a more complete admin session object to store
        const adminSession = {
          access_token: 'admin-token',
          refresh_token: 'admin-refresh-token',
          expires_at: Date.now() + 3600 * 1000, // 1 hour from now
          user: { 
            id: 'admin-id',
            email: 'admin@emrilacademy.tech',
            user_metadata: { role: 'admin' }
          }
        };
        
        // Store admin session in local storage using the exact key format that Supabase checks for
        localStorage.setItem('supabase.auth.token', JSON.stringify({
          currentSession: adminSession,
          expiresAt: adminSession.expires_at
        }));
        
        toast({
          title: "Admin signed in successfully",
          description: "Welcome back, admin!",
        });
        
        navigate('/admin');
        setLoginAttempts(0);
        
        return { 
          success: true, 
          error: null,
          session: adminSession
        };
      }
      
      // Sign in with Supabase for non-admin users
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error("Supabase auth error:", error);
        setLoginAttempts(prev => prev + 1);
        
        // Return a user-friendly error message
        if (error.message.includes("Invalid login credentials")) {
          return { 
            success: false, 
            error: "Invalid email or password. Please check your credentials and try again." 
          };
        }
        
        return { success: false, error: error.message };
      }
      
      console.log("Login successful:", {
        user: data.user?.id,
        hasSession: !!data.session
      });
      
      // Reset login attempts on successful login
      setLoginAttempts(0);
      
      // Get the user's role from profiles table
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .maybeSingle();

      if (profileError) {
        console.error("Error fetching user profile:", profileError);
      }
      
      toast({
        title: "Signed in successfully",
        description: "Welcome back!",
      });
      
      // Redirect based on role
      if (profile?.role === 'teacher') {
        navigate('/teacher');
      } else if (profile?.role === 'student') {
        navigate('/student');
      } else if (profile?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
      
      return { success: true, error: null, session: data.session };
    } catch (error: any) {
      console.error("Login error:", error);
      
      let errorMessage = error.message;
      
      // Provide more user-friendly error messages
      if (error.message.includes("Invalid login credentials")) {
        errorMessage = "Invalid email or password. Please try again.";
      } else if (error.message.includes("Email not confirmed")) {
        errorMessage = "Please check your email to confirm your account before logging in.";
      } else if (error.message.includes("rate limit")) {
        errorMessage = "Too many login attempts. Please try again later.";
      }
      
      toast({
        variant: "destructive",
        title: "Error signing in",
        description: errorMessage,
      });
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [navigate, toast, loginAttempts]);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      // First clear any special admin session if it exists
      localStorage.removeItem('supabase.auth.token');
      
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      toast({
        title: "Signed out successfully",
        description: "You have been logged out.",
      });
      
      navigate('/auth');
      return { success: true };
    } catch (error: any) {
      console.error("Logout error:", error);
      
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: error.message,
      });
      
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, [navigate, toast]);

  return { login, logout, loading };
};
