
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface DashboardMobileMenuProps {
  items: Array<{ label: string; path: string }>;
  isActive: (path: string) => boolean;
}

export function DashboardMobileMenu({ items, isActive }: DashboardMobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="rounded-lg bg-white dark:bg-gray-800 shadow-sm">
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full flex justify-between items-center px-4 py-3"
          >
            <span className="font-medium">Quick Navigation</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="p-0">
          <div className="py-4 px-1">
            <h3 className="px-4 text-sm font-medium text-gray-500 mb-2">Menu</h3>
            <nav className="space-y-1">
              {items.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center justify-between px-4 py-3 text-sm font-medium transition-colors",
                    isActive(item.path)
                      ? "bg-primary text-white rounded-md mx-1"
                      : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 rounded-md mx-1"
                  )}
                >
                  {item.label}
                  <ChevronRight className={cn(
                    "h-4 w-4", 
                    isActive(item.path) ? "text-white" : "text-gray-400"
                  )} />
                </Link>
              ))}
            </nav>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
