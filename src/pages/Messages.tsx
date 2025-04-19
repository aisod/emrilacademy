
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { MessagingInterface } from "@/components/messages/MessagingInterface";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export default function Messages() {
  const isMobile = useIsMobile();
  
  return (
    <DashboardLayout className="p-0">
      <div className={cn(
        "h-[calc(100vh-80px)]",
        isMobile && "h-[calc(100vh-64px)]"
      )}>
        <MessagingInterface />
      </div>
    </DashboardLayout>
  );
}
