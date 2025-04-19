
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
    <div className="md:hidden">
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="ghost" size="sm" className="w-full flex justify-between items-center">
            <span className="font-medium">Menu</span>
            <Menu className="h-5 w-5" />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="px-4 py-6">
            <nav className="flex flex-col gap-2">
              {items.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                    isActive(item.path)
                      ? "bg-primary text-white"
                      : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
