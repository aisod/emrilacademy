
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
  requiredRole?: "student" | "teacher";
  className?: string;
}

export const DashboardLayout = ({ 
  children, 
  requiredRole,
  className
}: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/auth');
        return;
      }

      if (requiredRole) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (!profile || profile.role !== requiredRole) {
          navigate('/');
        }
      }
    };

    checkAuth();
  }, [navigate, requiredRole]);

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="min-h-screen flex w-full bg-gray-50 dark:bg-gray-900">
        {isMobile ? (
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="fixed left-4 top-4 z-50 md:hidden text-gray-700 dark:text-white"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent 
              side="left" 
              className="p-0 max-w-[280px] border-none bg-white dark:bg-gray-900 shadow-lg"
            >
              <DashboardSidebar onMobileClose={() => setIsMobileMenuOpen(false)} />
            </SheetContent>
          </Sheet>
        ) : (
          <DashboardSidebar />
        )}
        
        <div className="flex-1">
          <div className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm md:hidden">
            <div className="flex items-center gap-2 ml-8">
              <span className="font-semibold text-gray-800 dark:text-white">
                EmRil Academy
              </span>
            </div>
          </div>
          <Navigation />
          <main className={cn("p-3 md:p-8 pt-14 md:pt-8 overflow-x-hidden", className)}>
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
