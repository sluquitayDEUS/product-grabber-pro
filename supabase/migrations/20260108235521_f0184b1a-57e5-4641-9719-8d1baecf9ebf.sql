-- Remove all existing policies
DROP POLICY IF EXISTS "No public access to abandoned carts" ON public.abandoned_carts;
DROP POLICY IF EXISTS "No public access - service role only" ON public.abandoned_carts;
DROP POLICY IF EXISTS "No public access to admin sessions" ON public.admin_sessions;
DROP POLICY IF EXISTS "No public access - service role only" ON public.admin_sessions;

-- Create RESTRICTIVE policies (not PERMISSIVE) that block all access
-- RESTRICTIVE means the policy must be satisfied AND other policies, effectively blocking all
CREATE POLICY "Block all public access"
ON public.abandoned_carts
AS RESTRICTIVE
FOR ALL
TO public
USING (false)
WITH CHECK (false);

CREATE POLICY "Block all public access"
ON public.admin_sessions
AS RESTRICTIVE
FOR ALL
TO public
USING (false)
WITH CHECK (false);