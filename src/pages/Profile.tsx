
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { ProfileContent } from "@/components/profile/ProfileContent";
import { ProfileLoadingState } from "@/components/profile/ProfileLoadingState";
import { useProfile } from "@/hooks/use-profile";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";
import { Link } from "react-router-dom";

export default function Profile() {
  const { loading, user, profile, setProfile } = useProfile();

  return (
    <DashboardLayout>
      <div className="space-y-6 bg-gray-50 p-4 sm:p-6 rounded-lg">
        <Breadcrumb className="bg-white p-2 rounded-md shadow-sm">
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/dashboard" className="text-primary hover:text-primary/80 flex items-center">
                <Home className="h-4 w-4 mr-1" />
                Dashboard
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbPage className="text-gray-700">Profile</BreadcrumbPage>
          </BreadcrumbItem>
        </Breadcrumb>
        
        {loading ? (
          <ProfileLoadingState />
        ) : !user || !profile ? (
          <div className="text-center p-8 bg-white rounded-lg border border-gray-200 shadow-sm">
            <p className="text-lg text-gray-600">
              Please sign in to view your profile.
            </p>
          </div>
        ) : (
          <div className="bg-transparent">
            <ProfileContent 
              user={user} 
              profile={profile} 
              setProfile={setProfile}
            />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
