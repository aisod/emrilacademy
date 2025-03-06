
import { useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { MessagingInterface } from "@/components/messages/MessagingInterface";

export default function Messages() {
  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-80px)]">
        <MessagingInterface />
      </div>
    </DashboardLayout>
  );
}
