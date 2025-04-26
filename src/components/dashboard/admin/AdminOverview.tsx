
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function AdminOverview() {
  const { data: profile } = useQuery({
    queryKey: ["admin-profile"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session");

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <h1 className="text-xl md:text-3xl font-bold text-gray-900 dark:text-white">
        Welcome, Admin {profile?.first_name}
      </h1>
      <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mt-1">
        Manage your platform and users from this dashboard
      </p>
    </div>
  );
}
