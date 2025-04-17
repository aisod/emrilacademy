
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, ChevronLeft, X } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarTrigger,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useUserRole } from "@/hooks/use-user-role";
import { MainLinks } from "./sidebar/MainLinks";
import { ClassLinks } from "./sidebar/ClassLinks";
import { ResourceLinks } from "./sidebar/ResourceLinks";

interface DashboardSidebarProps {
  onMobileClose?: () => void;
}

export function DashboardSidebar({ onMobileClose }: DashboardSidebarProps) {
  const location = useLocation();
  const { toggleSidebar } = useSidebar();
  const isMobile = useIsMobile();
  const { data: userRole } = useUserRole();

  // Check if a path is active, including for paths with parameters
  const isLinkActive = (path: string) => {
    // For exact matches
    if (location.pathname === path) return true;
    
    // For parameterized routes
    // For example, /live-classes/123 should match /live-classes
    if (path !== '/' && location.pathname.startsWith(path + '/')) return true;
    
    return false;
  };
  
  const dashboardPath = userRole === "teacher" ? "/teacher" : "/student";

  const handleLinkClick = () => {
    if (isMobile && onMobileClose) {
      onMobileClose();
    }
  };

  return (
    <Sidebar className="border-r border-gray-200 dark:border-gray-700">
      <SidebarHeader className="p-4 bg-sidebar dark:bg-gray-800 border-b border-sidebar-hover dark:border-gray-700 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-white dark:text-white flex items-center gap-2">
          <LayoutDashboard className="h-5 w-5" />
          <span>EmRil Academy</span>
        </Link>
        {isMobile && onMobileClose && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onMobileClose}
            className="text-white hover:bg-sidebar-hover dark:hover:bg-gray-700"
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </SidebarHeader>
      <SidebarContent className="bg-sidebar dark:bg-gray-800 text-sidebar-text dark:text-gray-200 h-full overflow-y-auto">
        <nav className="space-y-1 p-4">
          <MainLinks
            dashboardPath={dashboardPath}
            isLinkActive={isLinkActive}
            onLinkClick={handleLinkClick}
          />
          <ClassLinks
            isLinkActive={isLinkActive}
            isStudent={userRole === "student"}
            onLinkClick={handleLinkClick}
          />
          <ResourceLinks
            isLinkActive={isLinkActive}
            onLinkClick={handleLinkClick}
          />
        </nav>
      </SidebarContent>
      {!isMobile && (
        <SidebarTrigger className="absolute right-0 top-4 translate-x-full bg-white dark:bg-gray-800 p-2 rounded-r-lg border border-l-0 border-gray-200 dark:border-gray-700 shadow-sm">
          <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </SidebarTrigger>
      )}
    </Sidebar>
  );
}
