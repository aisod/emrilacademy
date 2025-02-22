
import { GraduationCap, BookOpen } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserRole } from "@/hooks/useSignup";

interface RoleSelectProps {
  value: UserRole;
  onValueChange: (value: UserRole) => void;
}

export const RoleSelect = ({ value, onValueChange }: RoleSelectProps) => {
  return (
    <div className="space-y-2">
      <label htmlFor="role" className="block text-sm font-medium text-gray-700">
        I want to
      </label>
      <Select value={value} onValueChange={(value) => onValueChange(value as UserRole)}>
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="student">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              <span>Learn as a Student</span>
            </div>
          </SelectItem>
          <SelectItem value="teacher">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span>Teach as an Instructor</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
