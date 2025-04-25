
import * as z from "zod";

export const profileFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters")
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
