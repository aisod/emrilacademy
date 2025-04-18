
import { useEffect, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UserAvatarProps {
  userId: string;
  avatarUrl: string | null;
  firstName: string;
  lastName: string;
  onAvatarUpdate: (url: string) => void;
}

export function UserAvatar({ userId, avatarUrl, firstName, lastName, onAvatarUpdate }: UserAvatarProps) {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const filePath = `${userId}/avatar.${fileExt}`;

      // Upload the file to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      onAvatarUpdate(publicUrl);

      toast({
        title: "Avatar updated",
        description: "Your profile picture has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating avatar",
        description: error.message,
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Avatar className="h-32 w-32">
        <AvatarImage src={avatarUrl || undefined} alt="Profile" />
        <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
          {firstName?.charAt(0)}{lastName?.charAt(0)}
        </AvatarFallback>
      </Avatar>
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          className="relative" 
          disabled={uploading}
        >
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            accept="image/*"
            onChange={uploadAvatar}
            disabled={uploading}
          />
          <Camera className="h-4 w-4 mr-2" />
          {uploading ? "Uploading..." : "Change Picture"}
        </Button>
      </div>
    </div>
  );
}
