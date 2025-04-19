import { Link } from "react-router-dom";
import { Menubar, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import { cn } from "@/lib/utils";

interface DashboardDesktopMenuProps {
  items: Array<{ label: string; path: string }>;
  isActive: (path: string) => boolean;
}

export function DashboardDesktopMenu({ items, isActive }: DashboardDesktopMenuProps) {
  return (
    <div className="hidden md:block bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <Menubar className="flex border-0 bg-transparent justify-start p-2 max-w-full gap-1">
        {items.map((item) => (
          <MenubarMenu key={item.path}>
            <MenubarTrigger asChild>
              <Link 
                to={item.path}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive(item.path)
                    ? "bg-primary text-white"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                )}
              >
                {item.label}
              </Link>
            </MenubarTrigger>
          </MenubarMenu>
        ))}
      </Menubar>
    </div>
  );
}
