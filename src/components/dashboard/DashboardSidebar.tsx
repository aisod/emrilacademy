
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Menu, ChevronLeft } from "lucide-react";
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

export function DashboardSidebar() {
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

  return (
    <>
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed left-4 top-4 z-50 md:hidden text-white bg-sidebar hover:bg-sidebar-hover"
          onClick={toggleSidebar}
        >
          <Menu className="h-6 w-6" />
        </Button>
      )}
      <Sidebar>
        <SidebarHeader className="p-4 bg-sidebar border-b border-sidebar-hover">
          <Link to="/" className="text-2xl font-bold text-white flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6" />
            <span>EmRil Academy</span>
          </Link>
        </SidebarHeader>
        <SidebarContent className="bg-sidebar text-sidebar-text">
          <nav className="space-y-2 p-4">
            <MainLinks
              dashboardPath={dashboardPath}
              isLinkActive={isLinkActive}
              onLinkClick={() => isMobile && toggleSidebar()}
            />
            <ClassLinks
              isLinkActive={isLinkActive}
              isStudent={userRole === "student"}
              onLinkClick={() => isMobile && toggleSidebar()}
            />
            <ResourceLinks
              isLinkActive={isLinkActive}
              onLinkClick={() => isMobile && toggleSidebar()}
            />
          </nav>
        </SidebarContent>
        {!isMobile && (
          <SidebarTrigger className="absolute right-0 top-4 translate-x-full bg-white dark:bg-gray-800 p-2 rounded-r-lg border border-l-0 border-gray-200 dark:border-gray-700 shadow-sm">
            <ChevronLeft className="h-5 w-5" />
          </SidebarTrigger>
        )}
      </Sidebar>
    </>
  );
}
