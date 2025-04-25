import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import type { User } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";
import { LogOut, Settings, User as UserIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function Navigation() {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      if (currentUser) {
        setTimeout(() => {
          fetchUserProfile(currentUser.id);
        }, 0);
      } else {
        setUserProfile(null);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      if (currentUser) {
        fetchUserProfile(currentUser.id);
      }
    });

    const handleStorageChange = async (event: StorageEvent) => {
      if (event.key === 'logout-event') {
        try {
          await supabase.auth.signOut();
          setUser(null);
          setUserProfile(null);
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

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;
      setUserProfile(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      localStorage.clear();
      localStorage.setItem('logout-event', Date.now().toString());
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setUserProfile(null);
      navigate('/');
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account."
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: error.message,
      });
    } finally {
      setIsMenuOpen(false);
    }
  };

  const getDashboardLink = () => {
    if (!userProfile) return '/student';
    return userProfile.role === 'teacher' ? '/teacher' : '/student';
  };

  if (!user) return null;

  return (
    <div className="fixed top-0 right-0 p-3 md:p-4 z-40">
      <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-9 w-9 md:h-10 md:w-10 rounded-full p-0">
            <Avatar className="h-full w-full border-2 border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all">
              <AvatarImage src={userProfile?.avatar_url} alt="Profile" />
              <AvatarFallback className="bg-primary text-white text-xs md:text-sm">
                {userProfile?.first_name?.charAt(0)}{userProfile?.last_name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="px-2 py-1.5">
            <div className="font-medium">
              <p className="text-sm">{userProfile?.first_name} {userProfile?.last_name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{userProfile?.email}</p>
            </div>
          </div>
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={() => {
              navigate(getDashboardLink());
              setIsMenuOpen(false);
            }}
            className="cursor-pointer"
          >
            <UserIcon className="w-4 h-4 mr-2" />
            Dashboard
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={() => {
              navigate('/profile');
              setIsMenuOpen(false);
            }}
            className="cursor-pointer"
          >
            <Settings className="w-4 h-4 mr-2" />
            Profile & Settings
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={handleSignOut} 
            className="text-red-500 cursor-pointer"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
