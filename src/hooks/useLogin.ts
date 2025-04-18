
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    setLoading(true);
    
    try {
      // Validate inputs
      if (!email || !password) {
        throw new Error("Email and password are required");
      }
      
      console.log("Attempting login for:", email);
      
      // Sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      
      console.log("Login successful:", {
        user: data.user?.id,
        hasSession: !!data.session
      });
      
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
  };

  return { login, loading };
};
