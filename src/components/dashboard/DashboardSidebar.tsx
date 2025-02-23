
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, GraduationCap, BookOpen, ChevronLeft, Search } from "lucide-react";
import { UnreadCount } from "@/components/messages/UnreadCount";
import {
  Sidebar,
  SidebarContent,
  SidebarTrigger,
  SidebarHeader,
} from "@/components/ui/sidebar";

export function DashboardSidebar() {
  const location = useLocation();

  const isLinkActive = (path: string) => location.pathname === path;

  return (
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
            to="/dashboard"
            className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
              isLinkActive("/dashboard")
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
      </SidebarContent>
      <SidebarTrigger className="absolute right-0 top-4 translate-x-full bg-white p-2 rounded-r-lg border border-l-0">
        <ChevronLeft className="h-5 w-5" />
      </SidebarTrigger>
    </Sidebar>
  );
}
