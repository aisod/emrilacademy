
import { PlayCircle, FileText, BookOpen } from "lucide-react";
import { SidebarLink } from "../SidebarLink";

interface ResourceLinksProps {
  isLinkActive: (path: string) => boolean;
  onLinkClick?: () => void;
}

export function ResourceLinks({ isLinkActive, onLinkClick }: ResourceLinksProps) {
  return (
    <>
      <SidebarLink
        to="/live-classes"
        icon={PlayCircle}
        label="Live Classes"
        isActive={isLinkActive("/live-classes")}
        onClick={onLinkClick}
      />
      <SidebarLink
        to="/resources"
        icon={FileText}
        label="Resources"
        isActive={isLinkActive("/resources")}
        onClick={onLinkClick}
      />
      <SidebarLink
        to="/teachers"
        icon={BookOpen}
        label="Teachers"
        isActive={isLinkActive("/teachers")}
        onClick={onLinkClick}
      />
    </>
  );
}
