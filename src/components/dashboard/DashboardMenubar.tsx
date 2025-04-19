
import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Menubar, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import { useUserRole } from "@/hooks/use-user-role";
import { cn } from "@/lib/utils";
import { DashboardMobileMenu } from "./DashboardMobileMenu";
import { useIsMobile } from "@/hooks/use-mobile"; // Add mobile hook import

export function DashboardMenubar() {
  const location = useLocation();
  const { data: userRole, isLoading } = useUserRole();
  const [mounted, setMounted] = useState(false);
  const isMobile = useIsMobile(); // Use mobile hook
  
  // Ensure component is mounted before rendering to prevent hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isLoading) {
    return <div className="h-10 animate-pulse bg-gray-100 dark:bg-gray-800 rounded-md"></div>;
  }

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const commonMenuItems = [
    {
      label: "Messages",
      path: "/messages",
    },
    {
      label: "Resources",
      path: "/resources",
    },
    {
      label: "Live Classes",
      path: "/live-classes",
    }
  ];

  const studentMenuItems = [
    {
      label: "Dashboard",
      path: "/student",
    },
    {
      label: "My Classes",
      path: "/courses",
    },
    {
      label: "Browse Classes",
      path: "/browse-classes",
    },
  ];

  const teacherMenuItems = [
    {
      label: "Dashboard",
      path: "/teacher",
    },
    {
      label: "My Classes",
      path: "/courses",
    },
  ];

  const menuItems = [
    ...(userRole === "student" ? studentMenuItems : teacherMenuItems),
    ...commonMenuItems,
  ];

  return (
    <div>
      <DashboardMobileMenu items={menuItems} isActive={isActive} />
      
      {!isMobile && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <Menubar className="flex border-0 bg-transparent justify-start p-2 max-w-full gap-1">
            {menuItems.map((item) => (
              <MenubarMenu key={item.path}>
                <MenubarTrigger asChild>
                  <Link 
                    to={item.path}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                      isActive(item.path)
                        ? "bg-primary text-white"
                        : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                    )}
                  >
                    {item.label}
                  </Link>
                </MenubarTrigger>
              </MenubarMenu>
            ))}
          </Menubar>
        </div>
      )}
    </div>
  );
}
