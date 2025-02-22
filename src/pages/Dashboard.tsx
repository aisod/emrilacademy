
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { MessageList } from "@/components/messages/MessageList";
import { SendMessage } from "@/components/messages/SendMessage";
import { Card } from "@/components/ui/card";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="animate-fade-up space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        
        <div className="grid gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Send Message</h2>
            <SendMessage />
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Messages</h2>
            <MessageList />
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
