
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCourses } from "@/hooks/use-courses";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Course } from "@/hooks/use-courses"; // Import Course type

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  duration_weeks: z.coerce.number().min(1, "Duration must be at least 1 week"),
  slug: z.string().min(1, "URL slug is required"),
});

type CourseFormData = z.infer<typeof formSchema>;

export function CourseForm() {
  const form = useForm<CourseFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      duration_weeks: 1,
      slug: "",
    },
  });

  const { createCourse } = useCourses();

  const onSubmit = (data: CourseFormData) => {
    createCourse.mutate({
      title: data.title,
      description: data.description || null,
      duration_weeks: data.duration_weeks,
      slug: data.slug,
      status: "draft",
      thumbnail_url: null,
    });
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
                <Input {...field} />
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
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={createCourse.isPending}>
          {createCourse.isPending ? "Creating..." : "Create Course"}
        </Button>
      </form>
    </Form>
  );
}
