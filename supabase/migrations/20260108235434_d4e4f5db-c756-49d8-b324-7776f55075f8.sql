-- Drop existing policies and create new restrictive ones for abandoned_carts
DROP POLICY IF EXISTS "Block all public access to abandoned_carts" ON public.abandoned_carts;

-- Create policy that blocks ALL access (only service_role can access)
CREATE POLICY "No public access - service role only" 
ON public.abandoned_carts 
FOR ALL 
USING (false)
WITH CHECK (false);

-- Drop existing policies and create new restrictive ones for admin_sessions
DROP POLICY IF EXISTS "Block all public access to admin_sessions" ON public.admin_sessions;

-- Create policy that blocks ALL access (only service_role can access)
CREATE POLICY "No public access - service role only" 
ON public.admin_sessions 
FOR ALL 
USING (false)
WITH CHECK (false);