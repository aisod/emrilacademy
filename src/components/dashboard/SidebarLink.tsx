
import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { UnreadCount } from "@/components/messages/UnreadCount";
import { cn } from "@/lib/utils";

interface SidebarLinkProps {
  to: string;
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  showUnreadCount?: boolean;
  onClick?: () => void;
}

export function SidebarLink({
  to,
  icon: Icon,
  label,
  isActive,
  showUnreadCount,
  onClick
}: SidebarLinkProps) {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center justify-between p-3 rounded-lg transition-colors font-medium",
        isActive
          ? "bg-primary text-white shadow-md"
          : "text-gray-900 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-100 dark:hover:bg-gray-800"
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5" />
        <span className="text-base">{label}</span>
      </div>
      {showUnreadCount && <UnreadCount />}
    </Link>
  );
}
