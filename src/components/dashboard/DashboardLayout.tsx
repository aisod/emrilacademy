
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardMenubar } from "@/components/dashboard/DashboardMenubar";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
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
        {/* Desktop sidebar */}
        <div className="hidden md:block">
          <DashboardSidebar />
        </div>
        
        <div className="flex-1">
          <Navigation />
          
          <div className="p-3 md:p-6 pt-16 md:pt-20 max-w-7xl mx-auto w-full">
            {/* Mobile menu bar only shown on mobile */}
            <div className="mb-4 md:hidden">
              <DashboardMenubar onMobileToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
            </div>
            
            {/* Desktop menu bar only shown on desktop */}
            <div className="mb-4 hidden md:block">
              <DashboardMenubar />
            </div>
            
            <main className={cn("overflow-x-hidden", className)}>
              {children}
            </main>
          </div>
        </div>
        
        {/* Mobile sidebar */}
        {isMobile && (
          <DashboardSidebar 
            isMobileOpen={isMobileMenuOpen} 
            onMobileClose={() => setIsMobileMenuOpen(false)} 
          />
        )}
      </div>
    </SidebarProvider>
  );
}
