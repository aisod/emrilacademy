
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useUserRole } from "@/hooks/use-user-role";
import { DashboardMobileMenu } from "./DashboardMobileMenu";
import { DashboardDesktopMenu } from "./DashboardDesktopMenu";
import { getMenuItems } from "./utils/menuItems";

export function DashboardMenubar() {
  const location = useLocation();
  const { data: userRole, isLoading } = useUserRole();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isLoading) {
    return <div className="h-10 animate-pulse bg-gray-100 dark:bg-gray-800 rounded-md"></div>;
  }

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const menuItems = getMenuItems(userRole);

  return (
    <div>
      <DashboardMobileMenu items={menuItems} isActive={isActive} />
      <DashboardDesktopMenu items={menuItems} isActive={isActive} />
    </div>
  );
}
