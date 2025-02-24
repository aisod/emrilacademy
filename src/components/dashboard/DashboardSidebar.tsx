
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

  const isLinkActive = (path: string) => location.pathname === path;
  const dashboardPath = userRole === "teacher" ? "/teacher" : "/student";

  return (
    <>
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed left-4 top-4 z-50 md:hidden"
          onClick={toggleSidebar}
        >
          <Menu className="h-6 w-6" />
        </Button>
      )}
      <Sidebar>
        <SidebarHeader className="p-4 border-b">
          <Link to="/" className="text-2xl font-bold text-primary flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6" />
            <span>Emmadex</span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
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
          <SidebarTrigger className="absolute right-0 top-4 translate-x-full bg-white p-2 rounded-r-lg border border-l-0">
            <ChevronLeft className="h-5 w-5" />
          </SidebarTrigger>
        )}
      </Sidebar>
    </>
  );
}
