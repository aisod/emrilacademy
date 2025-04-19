
import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem } from "@/components/ui/menubar";
import { useUserRole } from "@/hooks/use-user-role";
import { cn } from "@/lib/utils";

export function DashboardMenubar() {
  const location = useLocation();
  const { data: userRole, isLoading } = useUserRole();
  const [mounted, setMounted] = useState(false);
  
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

  const menuItemClass = "cursor-pointer";
  const activeClass = "bg-primary/10 font-medium";

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
    <Menubar className="border-0 bg-transparent justify-start overflow-x-auto p-0 max-w-full">
      {menuItems.map((item) => (
        <MenubarMenu key={item.path}>
          <MenubarTrigger asChild>
            <Link 
              to={item.path}
              className={cn(
                menuItemClass,
                isActive(item.path) && activeClass
              )}
            >
              {item.label}
            </Link>
          </MenubarTrigger>
        </MenubarMenu>
      ))}
    </Menubar>
  );
}
