
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserAvatar } from "./UserAvatar";
import { ProfileForm } from "./ProfileForm";
import { PasswordForm } from "./PasswordForm";
import type { User } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ProfileContentProps {
  user: User;
  profile: any;
  setProfile: (profile: any) => void;
}

export function ProfileContent({ user, profile, setProfile }: ProfileContentProps) {
  const { toast } = useToast();

  const handleProfileUpdate = async (values: { firstName: string; lastName: string }) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: values.firstName,
          last_name: values.lastName,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      setProfile({
        ...profile,
        first_name: values.firstName,
        last_name: values.lastName,
      });

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating profile",
        description: error.message,
      });
    }
  };

  const handlePasswordUpdate = async (values: { currentPassword: string; newPassword: string }) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: values.newPassword,
      });

      if (error) throw error;

      toast({
        title: "Password updated",
        description: "Your password has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating password",
        description: error.message,
      });
    }
  };

  const handleAvatarUpdate = async (avatarUrl: string) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      setProfile({
        ...profile,
        avatar_url: avatarUrl,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating avatar",
        description: error.message,
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6">
      <Card className="border border-gray-200 shadow-sm bg-white overflow-hidden">
        <CardHeader className="bg-white rounded-t-lg border-b border-gray-100 px-6 py-4">
          <CardTitle className="text-center text-gray-900 text-xl">Profile Settings</CardTitle>
        </CardHeader>
        <CardContent className="bg-white rounded-b-lg pt-6 px-6">
          <div className="space-y-8">
            <UserAvatar
              userId={user.id}
              avatarUrl={profile.avatar_url}
              firstName={profile.first_name}
              lastName={profile.last_name}
              onAvatarUpdate={handleAvatarUpdate}
            />

            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-100">
                <TabsTrigger 
                  value="profile" 
                  className="bg-white data-[state=active]:bg-primary data-[state=active]:text-white hover:bg-gray-50 transition-colors"
                >
                  Profile
                </TabsTrigger>
                <TabsTrigger 
                  value="security" 
                  className="bg-white data-[state=active]:bg-primary data-[state=active]:text-white hover:bg-gray-50 transition-colors"
                >
                  Security
                </TabsTrigger>
              </TabsList>
              <TabsContent 
                value="profile" 
                className="pt-4 bg-white border border-gray-100 rounded-b-md shadow-sm mt-2 p-4"
              >
                <ProfileForm
                  user={user}
                  profile={profile}
                  onSubmit={handleProfileUpdate}
                />
              </TabsContent>
              <TabsContent 
                value="security" 
                className="pt-4 bg-white border border-gray-100 rounded-b-md shadow-sm mt-2 p-4"
              >
                <PasswordForm onSubmit={handlePasswordUpdate} />
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
