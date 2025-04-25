
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCourses } from "@/hooks/use-courses";

// Create schema for course form validation
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

export function CourseForm() {
  const form = useForm<CourseFormData>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      title: "",
      description: "",
      duration_weeks: 1,
      slug: ""
    }
  });
  
  const { createCourse } = useCourses();

  const onSubmit = async (data: CourseFormData) => {
    try {
      await createCourse.mutateAsync({
        ...data,
        status: "draft",
        duration_weeks: Number(data.duration_weeks)
      });
      
      // Reset form on successful creation
      form.reset();
    } catch (error) {
      console.error("Error creating course:", error);
    }
  };

  // Generate slug from title automatically
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special chars
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-'); // Remove consecutive hyphens
  };

  // Update slug when title changes
  const handleTitleChange = (value: string) => {
    const currentSlug = form.getValues("slug");
    if (!currentSlug || currentSlug === "") {
      form.setValue("slug", generateSlug(value));
    }
  };

  return <Form {...form}>
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
          className="text-sky-500"
          disabled={createCourse.isPending}
        >
          {createCourse.isPending ? "Creating..." : "Create Course"}
        </Button>
      </form>
    </Form>;
}
