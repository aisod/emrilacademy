
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { ProfileContent } from "@/components/profile/ProfileContent";
import { ProfileLoadingState } from "@/components/profile/ProfileLoadingState";
import { useProfile } from "@/hooks/use-profile";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";
import { Link } from "react-router-dom";

export default function Profile() {
  const { loading, user, profile, setProfile } = useProfile();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/dashboard">
                <Home className="h-4 w-4 mr-1" />
                Dashboard
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink isCurrentPage>Profile</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        
        {loading ? (
          <ProfileLoadingState />
        ) : !user || !profile ? (
          <div className="text-center">
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Please sign in to view your profile.
            </p>
          </div>
        ) : (
          <ProfileContent 
            user={user} 
            profile={profile} 
            setProfile={setProfile}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
