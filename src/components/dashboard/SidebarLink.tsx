
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
        "flex items-center justify-between p-3 rounded-lg transition-all duration-200 relative",
        isActive
          ? "bg-blue-600 text-white font-semibold shadow-lg scale-[1.02] dark:bg-blue-700"
          : "text-gray-100 hover:bg-gray-700/60 hover:text-white hover:scale-[1.01] hover:shadow-md dark:text-gray-200 dark:hover:bg-gray-800"
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <Icon className={cn(
          "h-5 w-5",
          isActive ? "text-white" : "text-gray-300"
        )} />
        <span className={cn(
          "text-[15px] font-medium",
          isActive ? "text-white" : "text-gray-100"
        )}>
          {label}
        </span>
      </div>
      {showUnreadCount && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          <UnreadCount />
        </div>
      )}
    </Link>
  );
}
