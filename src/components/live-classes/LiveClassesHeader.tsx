
import { LiveClassSearch } from "./LiveClassSearch";

interface LiveClassesHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function LiveClassesHeader({ searchQuery, onSearchChange }: LiveClassesHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <h1 className="text-2xl font-bold">Live Class Sessions</h1>
      <LiveClassSearch 
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
      />
    </div>
  );
}
