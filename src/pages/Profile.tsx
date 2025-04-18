
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { ProfileContent } from "@/components/profile/ProfileContent";
import { ProfileLoadingState } from "@/components/profile/ProfileLoadingState";
import { useProfile } from "@/hooks/use-profile";

export default function Profile() {
  const { loading, user, profile, setProfile } = useProfile();

  if (loading) {
    return (
      <DashboardLayout>
        <ProfileLoadingState />
      </DashboardLayout>
    );
  }

  if (!user || !profile) {
    return (
      <DashboardLayout>
        <div className="text-center">
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Please sign in to view your profile.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <ProfileContent 
        user={user} 
        profile={profile} 
        setProfile={setProfile}
      />
    </DashboardLayout>
  );
}
