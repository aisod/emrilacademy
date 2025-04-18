
import { z } from "zod";

// Email validation schema with detailed error messages
export const emailSchema = z
  .string()
  .min(1, { message: "Email is required" })
  .email({ message: "Please enter a valid email address" });

// Password validation with strength requirements
export const passwordSchema = z
  .string()
  .min(1, { message: "Password is required" })
  .min(8, { message: "Password must be at least 8 characters" })
  .refine(
    (password) => /[A-Z]/.test(password),
    { message: "Password must contain at least one uppercase letter" }
  )
  .refine(
    (password) => /[a-z]/.test(password),
    { message: "Password must contain at least one lowercase letter" }
  )
  .refine(
    (password) => /[0-9]/.test(password),
    { message: "Password must contain at least one number" }
  );

// Simple password schema (for login only)
export const simplePasswordSchema = z
  .string()
  .min(1, { message: "Password is required" });

// Username validation
export const nameSchema = z
  .string()
  .min(1, { message: "Name is required" })
  .max(50, { message: "Name must be less than 50 characters" });

// Login form schema
export const loginFormSchema = z.object({
  email: emailSchema,
  password: simplePasswordSchema,
});

// Registration form schema
export const registerFormSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: nameSchema,
  lastName: nameSchema,
  role: z.enum(["student", "teacher"]),
});

// Utility function to validate email
export const isValidEmail = (email: string): boolean => {
  try {
    emailSchema.parse(email);
    return true;
  } catch {
    return false;
  }
};

// Utility function to check password strength
export const getPasswordStrength = (password: string): number => {
  if (!password) return 0;
  
  let strength = 0;
  if (password.length >= 8) strength += 1;
  if (/[A-Z]/.test(password)) strength += 1;
  if (/[a-z]/.test(password)) strength += 1;
  if (/[0-9]/.test(password)) strength += 1;
  if (/[^A-Za-z0-9]/.test(password)) strength += 1;
  
  return Math.min(strength, 5);
};

// Format validation error messages for display
export const formatValidationErrors = (errors: z.ZodFormattedError<any>): Record<string, string> => {
  const formattedErrors: Record<string, string> = {};
  
  for (const key in errors) {
    if (key !== '_errors' && errors[key]?._errors[0]) {
      formattedErrors[key] = errors[key]._errors[0];
    }
  }
  
  return formattedErrors;
};
