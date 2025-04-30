
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

export function AllUsersTable() {
  const [page, setPage] = useState(1);
  const pageSize = 20;

  // Fetch users from profiles table
  const { data: profileUsers, isLoading: isLoadingProfiles } = useQuery({
    queryKey: ["all-profiles", page],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .range((page - 1) * pageSize, page * pageSize - 1)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  // Fetch admin users from user_roles table
  const { data: adminUsers, isLoading: isLoadingAdmins } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "admin");

      if (error) throw error;
      return data?.map(item => item.user_id) || [];
    },
  });

  const isLoading = isLoadingProfiles || isLoadingAdmins;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading users...</span>
      </div>
    );
  }

  // Combine the data to show the correct role for admins
  const users = profileUsers?.map(user => {
    // Check if user is in the admin list
    const isAdmin = adminUsers?.includes(user.id);
    return {
      ...user,
      // Override role if user is admin
      role: isAdmin ? "admin" : user.role
    };
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">All Users</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Complete list of all users in the system</p>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-mono text-xs">
                  {user.id.substring(0, 8)}...
                </TableCell>
                <TableCell>
                  {user.first_name} {user.last_name}
                </TableCell>
                <TableCell>
                  <Badge variant={
                    user.role === 'admin' 
                      ? 'destructive' 
                      : user.role === 'teacher' 
                      ? 'default' 
                      : 'secondary'
                  }>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(user.created_at).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {(!users || users.length === 0) && (
        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
          No users found
        </div>
      )}
    </div>
  );
}
