import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCourses, type Course } from "@/hooks/use-courses";

const courseFormSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().optional(),
  duration_weeks: z.coerce.number().positive({ message: "Duration must be a positive number" }),
  slug: z.string()
    .min(3, { message: "Slug must be at least 3 characters" })
    .max(50, { message: "Slug cannot be longer than 50 characters" })
    .regex(/^[a-z0-9-]+$/, { 
      message: "Slug can only contain lowercase letters, numbers, and hyphens" 
    })
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
      slug: initialData?.slug || ""
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
            duration_weeks: Number(data.duration_weeks)
          }
        });
      } else {
        await createCourse.mutateAsync({
          title: data.title,
          slug: data.slug,
          description: data.description,
          status: "draft",
          duration_weeks: Number(data.duration_weeks)
        });
      }
      
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error("Error saving course:", error);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special chars
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-'); // Remove consecutive hyphens
  };

  const handleTitleChange = (value: string) => {
    const currentSlug = form.getValues("slug");
    if (!currentSlug || currentSlug === "") {
      form.setValue("slug", generateSlug(value));
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
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="duration_weeks"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration (weeks)</FormLabel>
              <FormControl>
                <Input type="number" min="1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL Slug</FormLabel>
              <FormControl>
                <Input {...field} placeholder="course-url-slug" />
              </FormControl>
              <FormMessage className="text-xs">
                Letters, numbers and hyphens only. Will be used for the course URL.
              </FormMessage>
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full text-sky-500"
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
