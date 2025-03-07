
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, FilterX } from "lucide-react";
import { TeacherCard } from "./TeacherCard";
import { TeacherGridSkeleton } from "./TeacherGridSkeleton";

export function TeachersGrid() {
  const [searchTerm, setSearchTerm] = useState("");
  const [subjectFilter, setSubjectFilter] = useState<string>("all");
  const [experienceFilter, setExperienceFilter] = useState<string>("all");

  const { data: teachers, isLoading } = useQuery({
    queryKey: ["teachers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          id,
          first_name,
          last_name,
          avatar_url,
          classes(count)
        `)
        .eq("role", "teacher");

      if (error) throw error;
      return data || [];
    },
  });

  // Apply filters
  const filteredTeachers = teachers
    ? teachers.filter((teacher) => {
        const fullName = `${teacher.first_name} ${teacher.last_name}`.toLowerCase();
        return fullName.includes(searchTerm.toLowerCase());
      })
    : [];

  const clearFilters = () => {
    setSearchTerm("");
    setSubjectFilter("all");
    setExperienceFilter("all");
  };

  if (isLoading) {
    return <TeacherGridSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search teachers..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Select value={subjectFilter} onValueChange={setSubjectFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              <SelectItem value="math">Mathematics</SelectItem>
              <SelectItem value="science">Science</SelectItem>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="history">History</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={experienceFilter} onValueChange={setExperienceFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Experience" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Experience</SelectItem>
              <SelectItem value="beginner">1+ Years</SelectItem>
              <SelectItem value="intermediate">3+ Years</SelectItem>
              <SelectItem value="expert">5+ Years</SelectItem>
            </SelectContent>
          </Select>
          
          {(searchTerm || subjectFilter !== "all" || experienceFilter !== "all") && (
            <Button variant="outline" onClick={clearFilters} className="w-full sm:w-auto">
              <FilterX className="h-4 w-4 mr-2" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {filteredTeachers.length === 0 ? (
        <div className="text-center p-10 border rounded-lg">
          <h3 className="text-lg font-medium">No teachers found</h3>
          <p className="text-gray-500 mt-2">
            Try adjusting your search criteria or clear the filters
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeachers.map((teacher) => (
            <TeacherCard key={teacher.id} teacher={teacher} />
          ))}
        </div>
      )}
    </div>
  );
}
