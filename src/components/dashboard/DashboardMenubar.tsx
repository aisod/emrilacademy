
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useUserRole } from "@/hooks/use-user-role";
import { useIsMobile } from "@/hooks/use-mobile";
import { DashboardMobileMenu } from "./DashboardMobileMenu";
import { DashboardDesktopMenu } from "./DashboardDesktopMenu";
import { getMenuItems } from "./utils/menuItems";

export function DashboardMenubar() {
  const location = useLocation();
  const { data: userRole, isLoading } = useUserRole();
  const [mounted, setMounted] = useState(false);
  const isMobile = useIsMobile();
  
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
      {!isMobile && <DashboardDesktopMenu items={menuItems} isActive={isActive} />}
    </div>
  );
}
