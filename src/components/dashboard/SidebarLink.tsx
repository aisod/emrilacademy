
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
        "flex items-center justify-between p-3 rounded-lg transition-colors",
        isActive
          ? "bg-primary text-white"
          : "text-gray-600 hover:bg-gray-100"
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5" />
        <span>{label}</span>
      </div>
      {showUnreadCount && <UnreadCount />}
    </Link>
  );
}
