
import { Search, GraduationCap } from "lucide-react";
import { SidebarLink } from "../SidebarLink";

interface ClassLinksProps {
  isLinkActive: (path: string) => boolean;
  isStudent: boolean;
  onLinkClick?: () => void;
}

export function ClassLinks({ isLinkActive, isStudent, onLinkClick }: ClassLinksProps) {
  return (
    <>
      {isStudent && (
        <SidebarLink
          to="/browse-classes"
          icon={Search}
          label="Browse Classes"
          isActive={isLinkActive("/browse-classes")}
          onClick={onLinkClick}
        />
      )}
      <SidebarLink
        to="/courses"
        icon={GraduationCap}
        label="My Classes"
        isActive={isLinkActive("/courses")}
        onClick={onLinkClick}
      />
    </>
  );
}
