
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { generateSlug, isValidSlug } from "@/utils/slug-utils";
import { useCourses, type Course } from "@/hooks/use-courses";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const courseFormSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().optional(),
  duration_weeks: z.coerce.number()
    .positive({ message: "Duration must be a positive number" })
    .min(1, { message: "Duration must be at least 1 week" })
    .max(52, { message: "Duration cannot exceed 52 weeks" }),
  slug: z.string()
    .min(3, { message: "Slug must be at least 3 characters" })
    .max(50, { message: "Slug cannot be longer than 50 characters" })
    .regex(/^[a-z0-9-]+$/, { 
      message: "Slug can only contain lowercase letters, numbers, and hyphens" 
    })
    .refine(val => !val.startsWith('-') && !val.endsWith('-'), {
      message: "Slug cannot start or end with a hyphen"
    }),
  status: z.enum(["draft", "published"]).default("draft")
});

type CourseFormData = z.infer<typeof courseFormSchema>;

interface CourseFormProps {
  initialData?: Course;
  onSuccess?: () => void;
}

export function CourseForm({ initialData, onSuccess }: CourseFormProps) {
  const form = useForm<CourseFormData>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      duration_weeks: initialData?.duration_weeks || 1,
      slug: initialData?.slug || "",
      status: (initialData?.status as "draft" | "published") || "draft"
    }
  });
  
  const { createCourse, updateCourse } = useCourses();
  const isEditing = !!initialData;

  const onSubmit = async (data: CourseFormData) => {
    try {
      if (isEditing) {
        await updateCourse.mutateAsync({
          id: initialData.id,
          data: {
            title: data.title,
            slug: data.slug,
            description: data.description,
            duration_weeks: Number(data.duration_weeks),
            status: data.status
          }
        });
      } else {
        await createCourse.mutateAsync({
          title: data.title,
          slug: data.slug,
          description: data.description,
          status: data.status,
          duration_weeks: Number(data.duration_weeks)
        });
      }
      
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error("Error saving course:", error);
    }
  };

  // Generate slug based on title
  const handleTitleChange = (value: string) => {
    const currentSlug = form.getValues("slug");
    if (!currentSlug || currentSlug === "") {
      const newSlug = generateSlug(value);
      form.setValue("slug", newSlug);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  onChange={(e) => {
                    field.onChange(e);
                    handleTitleChange(e.target.value);
                  }}
                  placeholder="Introduction to Programming"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  placeholder="A comprehensive guide to programming basics..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="duration_weeks"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (weeks)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="1" 
                    max="52" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Between 1-52 weeks
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Draft courses are only visible to you
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL Slug</FormLabel>
              <FormControl>
                <Input {...field} placeholder="course-url-slug" />
              </FormControl>
              <FormDescription>
                Letters, numbers and hyphens only. Will be used for the course URL.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full"
          disabled={createCourse.isPending || updateCourse.isPending}
        >
          {isEditing 
            ? (updateCourse.isPending ? "Saving..." : "Save Changes")
            : (createCourse.isPending ? "Creating..." : "Create Course")
          }
        </Button>
      </form>
    </Form>
  );
}
