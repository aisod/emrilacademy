
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { ClassList } from "@/components/classes/ClassList";
import { Input } from "@/components/ui/input";
import { Search, Calendar, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function BrowseClasses() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("upcoming");
  const [classType, setClassType] = useState("all");
  const [capacity, setCapacity] = useState("any");

  const { data: classes, isLoading } = useQuery({
    queryKey: ["available-classes", searchQuery, sortBy, classType, capacity],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No authenticated user");

      let query = supabase
        .from("classes")
        .select(`
          *,
          teacher:profiles!teacher_id(
            first_name,
            last_name
          ),
          enrollments:enrollments(count),
          enrolled:enrollments(student_id)
        `)
        .ilike("title", `%${searchQuery}%`);
      
      // Filter by class type if not "all"
      if (classType !== "all") {
        query = query.eq("class_type", classType);
      }
      
      // Filter by capacity
      if (capacity === "available") {
        // Find classes that have space available
        query = query.neq("enrollments.count", 0);
      } else if (capacity === "full") {
        // Find classes that are near capacity (>80%)
        // This is a simplification since we can't do complex comparisons in the query
        // We'll filter more precisely in the client side
      }
      
      // Sort options
      if (sortBy === "upcoming") {
        query = query.gte("start_time", new Date().toISOString()).order("start_time");
      } else if (sortBy === "newest") {
        query = query.order("created_at", { ascending: false });
      } else if (sortBy === "popular") {
        query = query.order("enrollments.count", { ascending: false });
      } else if (sortBy === "title") {
        query = query.order("title");
      }

      const { data, error } = await query;

      if (error) throw error;

      // Map the classes with enrollment status using the current user's ID from session
      const mappedData = data.map(class_ => ({
        ...class_,
        isEnrolled: class_.enrolled?.some(e => e.student_id === session.user.id)
      }));
      
      // Additional client-side filtering for capacity if needed
      if (capacity === "full") {
        return mappedData.filter(c => 
          (c.enrollments[0]?.count || 0) >= c.capacity * 0.8
        );
      }
      
      return mappedData;
    },
  });

  return (
    <DashboardLayout requiredRole="student">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Browse Classes</h1>
          <p className="text-gray-500 mt-1">
            Discover and enroll in available classes
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search classes..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="upcoming">Upcoming First</SelectItem>
              <SelectItem value="newest">Recently Added</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="title">Alphabetical</SelectItem>
            </SelectContent>
          </Select>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full md:w-auto">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Class Type</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      variant={classType === "all" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setClassType("all")}
                    >
                      All Classes
                    </Button>
                    <Button 
                      variant={classType === "live" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setClassType("live")}
                    >
                      Live Classes
                    </Button>
                    <Button 
                      variant={classType === "recorded" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setClassType("recorded")}
                    >
                      Recorded
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Availability</h4>
                  <div className="grid grid-cols-3 gap-2">
                    <Button 
                      variant={capacity === "any" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCapacity("any")}
                    >
                      Any
                    </Button>
                    <Button 
                      variant={capacity === "available" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCapacity("available")}
                    >
                      Available
                    </Button>
                    <Button 
                      variant={capacity === "full" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCapacity("full")}
                    >
                      Nearly Full
                    </Button>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          <Button variant="outline" className="w-full md:w-auto">
            <Calendar className="mr-2 h-4 w-4" />
            Calendar View
          </Button>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All Classes</TabsTrigger>
            <TabsTrigger value="live">Live Classes</TabsTrigger>
            <TabsTrigger value="recorded">Recorded</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            <ClassList classes={classes || []} isLoading={isLoading} />
          </TabsContent>
          
          <TabsContent value="live" className="mt-6">
            <ClassList 
              classes={(classes || []).filter(c => c.class_type === 'live')} 
              isLoading={isLoading} 
            />
          </TabsContent>
          
          <TabsContent value="recorded" className="mt-6">
            <ClassList 
              classes={(classes || []).filter(c => c.class_type === 'recorded')} 
              isLoading={isLoading} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
