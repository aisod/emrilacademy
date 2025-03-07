
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { Upload } from "lucide-react";

interface ResourceUploadProps {
  classId: string;
  category: string;
  onSuccess: () => void;
}

export function ResourceUpload({ classId, category, onSuccess }: ResourceUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a file to upload",
      });
      return;
    }

    try {
      setIsUploading(true);

      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `${classId}/${fileName}`;

      console.log('Starting file upload:', { filePath, fileSize: file.size });

      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('resources')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      console.log('File uploaded successfully:', uploadData);

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('resources')
        .getPublicUrl(filePath);

      console.log('Generated public URL:', publicUrl);

      // Create resource record
      const { error: dbError, data: resourceData } = await supabase
        .from('resources')
        .insert({
          title,
          description,
          file_url: publicUrl,
          class_id: classId,
          category: category
        })
        .select()
        .single();

      if (dbError) {
        console.error('Database error:', dbError);
        throw dbError;
      }

      console.log('Resource record created:', resourceData);

      toast({
        title: "Success",
        description: "Resource uploaded successfully",
      });

      setTitle("");
      setDescription("");
      setFile(null);
      onSuccess();
    } catch (error: any) {
      console.error('Upload process error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to upload resource",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="file">File</Label>
        <Input
          id="file"
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          required
          accept="*/*"
        />
      </div>

      <Button type="submit" disabled={isUploading} className="w-full">
        <Upload className="mr-2 h-4 w-4" />
        {isUploading ? "Uploading..." : "Upload Resource"}
      </Button>
    </form>
  );
}
