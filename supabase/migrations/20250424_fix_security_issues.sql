
-- Fix check_class_capacity function by adding search_path
CREATE OR REPLACE FUNCTION public.check_class_capacity()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
DECLARE
  current_count INTEGER;
  max_capacity INTEGER;
BEGIN
  -- Get current enrollment count and class capacity
  SELECT COUNT(*), c.capacity 
  INTO current_count, max_capacity
  FROM enrollments e
  JOIN classes c ON c.id = e.class_id
  WHERE c.id = NEW.class_id
  GROUP BY c.capacity;

  -- Check if adding this enrollment would exceed capacity
  IF current_count >= max_capacity THEN
    RAISE EXCEPTION 'Class has reached maximum capacity of % students', max_capacity;
  END IF;

  RETURN NEW;
END;
$function$;

-- Fix handle_updated_at function by adding search_path
CREATE OR REPLACE FUNCTION public.handle_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$;

-- Fix handle_updated_at_emails function by adding search_path
CREATE OR REPLACE FUNCTION public.handle_updated_at_emails()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;
