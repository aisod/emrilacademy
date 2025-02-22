
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";
import { LogOut } from "lucide-react";

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
    const handleStorageChange = async (event: StorageEvent) => {
      if (event.key === 'logout-event') {
        // Clear any local session data
        try {
          await supabase.auth.signOut();
          setUser(null);
          // Force clear local storage to ensure no lingering session data
          localStorage.clear();
          // Force refresh the page to ensure clean state
          window.location.reload();
        } catch (error) {
          console.error('Error during cross-tab logout:', error);
          // Force refresh anyway to ensure synchronized state
          window.location.reload();
        }
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
      // First clear any local storage data
      localStorage.clear();
      
      // Notify other tabs about logout
      localStorage.setItem('logout-event', Date.now().toString());
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear local state
      setUser(null);
      
      // Force reload the page to ensure clean state
      window.location.reload();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: error.message,
      });
      // Force reload anyway to ensure synchronized state
      window.location.reload();
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
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2"
              >
                Sign Out <LogOut className="w-4 h-4" />
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
