
import { useState } from "react";
import { ContactsList } from "./ContactsList";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function MessagingInterface() {
  const [activeTab, setActiveTab] = useState<string>("direct");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex h-full border rounded-lg overflow-hidden bg-white shadow">
      <div className="w-full md:w-80 border-r border-gray-100 flex flex-col bg-white">
        <div className="p-4 border-b border-gray-100 bg-white shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Messages</h2>
          
          <Tabs 
            defaultValue="direct" 
            className="w-full"
            value={activeTab}
            onValueChange={(value) => setActiveTab(value)}
          >
            <TabsList className="w-full grid grid-cols-2 mb-4">
              <TabsTrigger value="direct" className="text-sm">Direct</TabsTrigger>
              <TabsTrigger value="class" className="text-sm">Classes</TabsTrigger>
            </TabsList>
          
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-gray-50"
                disabled
              />
            </div>
          
            <div className="mt-4">
              <TabsContent value="direct" className="m-0 p-0">
                <div className="flex items-center justify-center h-[300px] text-gray-500 p-4 text-center bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium mb-1">Contacts Coming Soon</p>
                    <p className="text-xs text-gray-400">We're working on populating your contacts list</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="class" className="m-0 p-0">
                <div className="flex items-center justify-center h-[300px] text-gray-500 p-4 text-center bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium mb-1">Class Messages Coming Soon</p>
                    <p className="text-xs text-gray-400">You'll be able to chat with your classes here</p>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col bg-gray-50 items-center justify-center">
        <div className="text-center max-w-sm p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Messaging Feature Coming Soon</h3>
          <p className="text-sm text-gray-500 mb-4">
            We're actively working on implementing full messaging functionality. 
            Stay tuned for updates!
          </p>
          <Button variant="outline" disabled>Send Message</Button>
        </div>
      </div>
    </div>
  );
}
