
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface LiveClassSearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function LiveClassSearch({ searchQuery, onSearchChange }: LiveClassSearchProps) {
  return (
    <div className="relative w-full sm:w-64">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
      <Input
        type="search"
        placeholder="Search sessions..."
        className="pl-8"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
}
