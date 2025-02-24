
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import type { User } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";
import { LogOut } from "lucide-react";
import { Button } from "./ui/button";

export function Navigation() {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    const handleStorageChange = async (event: StorageEvent) => {
      if (event.key === 'logout-event') {
        try {
          await supabase.auth.signOut();
          setUser(null);
          localStorage.clear();
          window.location.reload();
        } catch (error) {
          console.error('Error during cross-tab logout:', error);
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
      localStorage.clear();
      localStorage.setItem('logout-event', Date.now().toString());
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      window.location.reload();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: error.message,
      });
      window.location.reload();
    }
  };

  return (
    <div className="fixed top-0 right-0 p-4 z-50">
      {user && (
        <Button
          onClick={handleSignOut}
          variant="outline"
          className="bg-white shadow-sm"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      )}
    </div>
  );
}
