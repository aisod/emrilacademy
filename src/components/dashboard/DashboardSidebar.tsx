
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, GraduationCap, BookOpen, ChevronLeft, Search, Menu } from "lucide-react";
import { UnreadCount } from "@/components/messages/UnreadCount";
import {
  Sidebar,
  SidebarContent,
  SidebarTrigger,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

export function DashboardSidebar() {
  const location = useLocation();
  const { toggleSidebar } = useSidebar();
  const isMobile = useIsMobile();

  const { data: userRole } = useQuery({
    queryKey: ["user-role"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;

      const { data } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      return data?.role;
    },
  });

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
            <Link
              to={dashboardPath}
              className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                isLinkActive(dashboardPath)
                  ? "bg-primary text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => isMobile && toggleSidebar()}
            >
              <div className="flex items-center gap-2">
                <LayoutDashboard className="h-5 w-5" />
                <span>Dashboard</span>
              </div>
              <UnreadCount />
            </Link>
            {userRole === "student" && (
              <Link
                to="/browse-classes"
                className={`flex items-center gap-2 p-3 rounded-lg transition-colors ${
                  isLinkActive("/browse-classes")
                    ? "bg-primary text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                onClick={() => isMobile && toggleSidebar()}
              >
                <Search className="h-5 w-5" />
                <span>Browse Classes</span>
              </Link>
            )}
            <Link
              to="/courses"
              className={`flex items-center gap-2 p-3 rounded-lg transition-colors ${
                isLinkActive("/courses")
                  ? "bg-primary text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => isMobile && toggleSidebar()}
            >
              <GraduationCap className="h-5 w-5" />
              <span>My Classes</span>
            </Link>
            <Link
              to="/teachers"
              className={`flex items-center gap-2 p-3 rounded-lg transition-colors ${
                isLinkActive("/teachers")
                  ? "bg-primary text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => isMobile && toggleSidebar()}
            >
              <BookOpen className="h-5 w-5" />
              <span>Teachers</span>
            </Link>
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
