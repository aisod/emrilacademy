
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
        "flex items-center justify-between p-3 rounded-lg transition-all duration-200",
        isActive
          ? "bg-primary text-white font-semibold shadow-lg scale-[1.02]"
          : "text-gray-900 hover:bg-gray-100/80 hover:scale-[1.01] hover:shadow-md dark:text-gray-100 dark:hover:bg-gray-800/90"
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5" />
        <span className="text-[15px] font-medium">{label}</span>
      </div>
      {showUnreadCount && <UnreadCount />}
    </Link>
  );
}
