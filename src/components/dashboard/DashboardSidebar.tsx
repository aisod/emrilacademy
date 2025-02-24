
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
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export function DashboardSidebar() {
  const location = useLocation();
  const { openMobile, setOpenMobile } = useSidebar();

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

  const NavContent = () => (
    <nav className="space-y-2 p-4">
      <Link
        to={dashboardPath}
        className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
          isLinkActive(dashboardPath)
            ? "bg-primary text-white"
            : "text-gray-600 hover:bg-gray-100"
        }`}
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
      >
        <BookOpen className="h-5 w-5" />
        <span>Teachers</span>
      </Link>
    </nav>
  );

  return (
    <>
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 h-16 border-b bg-background z-50 md:hidden flex items-center px-4">
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10"
          onClick={() => setOpenMobile(true)}
        >
          <Menu className="h-6 w-6" />
        </Button>
        <div className="ml-4">
          <Link to="/" className="text-xl font-bold text-primary flex items-center gap-2">
            <LayoutDashboard className="h-5 w-5" />
            <span>Emmadex</span>
          </Link>
        </div>
      </div>

      {/* Mobile Sheet */}
      <Sheet open={openMobile} onOpenChange={setOpenMobile}>
        <SheetContent side="left" className="w-[280px] p-0">
          <div className="flex h-full flex-col">
            <div className="p-4 border-b">
              <Link to="/" className="text-2xl font-bold text-primary flex items-center gap-2">
                <LayoutDashboard className="h-6 w-6" />
                <span>Emmadex</span>
              </Link>
            </div>
            <NavContent />
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar>
          <SidebarHeader className="p-4 border-b">
            <Link to="/" className="text-2xl font-bold text-primary flex items-center gap-2">
              <LayoutDashboard className="h-6 w-6" />
              <span>Emmadex</span>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <NavContent />
          </SidebarContent>
          <div className="hidden md:block">
            <SidebarTrigger className="absolute right-0 top-4 translate-x-full bg-white p-2 rounded-r-lg border border-l-0">
              <ChevronLeft className="h-5 w-5" />
            </SidebarTrigger>
          </div>
        </Sidebar>
      </div>
    </>
  );
}
