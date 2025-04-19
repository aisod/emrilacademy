
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useUserRole } from "@/hooks/use-user-role";
import { DashboardMobileMenu } from "./DashboardMobileMenu";
import { DashboardDesktopMenu } from "./DashboardDesktopMenu";
import { getMenuItems } from "./utils/menuItems";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardMenubarProps {
  onMobileToggle?: () => void;
}

export function DashboardMenubar({ onMobileToggle }: DashboardMenubarProps) {
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
    <>
      {/* Mobile menu button and menu */}
      <div className="md:hidden">
        {onMobileToggle && (
          <Button 
            variant="outline"
            size="sm"
            onClick={onMobileToggle}
            className="mb-2"
            aria-label="Open sidebar menu"
          >
            <Menu className="h-4 w-4 mr-2" />
            <span>Menu</span>
          </Button>
        )}
        <DashboardMobileMenu items={menuItems} isActive={isActive} />
      </div>
      
      {/* Desktop menu */}
      <div className="hidden md:block">
        <DashboardDesktopMenu items={menuItems} isActive={isActive} />
      </div>
    </>
  );
}
