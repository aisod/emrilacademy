
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
    <div className="max-w-4xl mx-auto space-y-8 p-6 bg-white">
      <Card className="border border-gray-300 shadow-md bg-white overflow-hidden">
        <CardHeader className="bg-white rounded-t-lg border-b border-gray-300 px-6 py-4">
          <CardTitle className="text-center text-gray-800 text-xl font-semibold">Profile Settings</CardTitle>
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
              <TabsList className="grid w-full grid-cols-2 mb-6 border border-gray-300 rounded-md overflow-hidden">
                <TabsTrigger 
                  value="profile" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=inactive]:bg-white data-[state=inactive]:text-gray-800 py-3 font-medium text-base"
                >
                  Profile
                </TabsTrigger>
                <TabsTrigger 
                  value="security" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=inactive]:bg-white data-[state=inactive]:text-gray-800 py-3 font-medium text-base"
                >
                  Security
                </TabsTrigger>
              </TabsList>
              <TabsContent 
                value="profile" 
                className="bg-white rounded-md"
              >
                <ProfileForm
                  user={user}
                  profile={profile}
                  onSubmit={handleProfileUpdate}
                />
              </TabsContent>
              <TabsContent 
                value="security" 
                className="bg-white rounded-md"
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
