
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";

export function Navigation() {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    // Listen for logout events from other tabs
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'logout-event') {
        window.location.href = "/";
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        // If we get a session missing error, we can safely ignore it
        // as the user is already signed out
        if (error.message.includes("session")) {
          // Notify other tabs about logout
          localStorage.setItem('logout-event', Date.now().toString());
          window.location.href = "/";
          return;
        }
        throw error;
      }
      
      // Notify other tabs about logout
      localStorage.setItem('logout-event', Date.now().toString());
      // Redirect to home page after successful logout
      window.location.href = "/";
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  return (
    <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-primary">
          Emmadex
        </Link>
        <div className="hidden md:flex space-x-8">
          <Link to="/" className="text-gray-600 hover:text-primary transition-colors">
            Home
          </Link>
          <Link to="/courses" className="text-gray-600 hover:text-primary transition-colors">
            Courses
          </Link>
          <Link to="/teachers" className="text-gray-600 hover:text-primary transition-colors">
            Teachers
          </Link>
          <Link to="/about" className="text-gray-600 hover:text-primary transition-colors">
            About
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span className="text-gray-600">Welcome!</span>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/auth"
                className="px-4 py-2 text-primary hover:text-primary/80 transition-colors"
              >
                Log in
              </Link>
              <Link
                to="/auth"
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
