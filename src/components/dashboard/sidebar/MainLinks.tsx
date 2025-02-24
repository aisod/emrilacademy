
import { LayoutDashboard, MessageSquare } from "lucide-react";
import { SidebarLink } from "../SidebarLink";

interface MainLinksProps {
  dashboardPath: string;
  isLinkActive: (path: string) => boolean;
  onLinkClick?: () => void;
}

export function MainLinks({ dashboardPath, isLinkActive, onLinkClick }: MainLinksProps) {
  return (
    <>
      <SidebarLink
        to={dashboardPath}
        icon={LayoutDashboard}
        label="Dashboard"
        isActive={isLinkActive(dashboardPath)}
        showUnreadCount
        onClick={onLinkClick}
      />
      <SidebarLink
        to="/messages"
        icon={MessageSquare}
        label="Messages"
        isActive={isLinkActive("/messages")}
        showUnreadCount
        onClick={onLinkClick}
      />
    </>
  );
}
