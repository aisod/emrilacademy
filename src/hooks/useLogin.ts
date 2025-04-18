
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
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to sign in",
      });
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  return { login, loading };
};
