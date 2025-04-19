
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface DashboardMobileMenuProps {
  items: Array<{ label: string; path: string }>;
  isActive: (path: string) => boolean;
}

export function DashboardMobileMenu({ items, isActive }: DashboardMobileMenuProps) {
  return (
    <div className="rounded-lg bg-white dark:bg-gray-800 shadow-sm">
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="ghost" size="sm" className="w-full flex justify-between items-center px-4">
            <span className="font-medium">Menu</span>
            <Menu className="h-5 w-5" />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="p-0">
          <nav className="px-4 py-2">
            {items.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "px-4 py-3 rounded-lg text-sm font-medium transition-colors block",
                  isActive(item.path)
                    ? "bg-primary text-white"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
