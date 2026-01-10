-- Drop existing permissive policies if any
DROP POLICY IF EXISTS "Allow public select on abandoned_carts" ON public.abandoned_carts;
DROP POLICY IF EXISTS "Allow public insert on abandoned_carts" ON public.abandoned_carts;
DROP POLICY IF EXISTS "Allow public update on abandoned_carts" ON public.abandoned_carts;
DROP POLICY IF EXISTS "Allow public delete on abandoned_carts" ON public.abandoned_carts;
DROP POLICY IF EXISTS "Allow public select on admin_sessions" ON public.admin_sessions;
DROP POLICY IF EXISTS "Allow public insert on admin_sessions" ON public.admin_sessions;
DROP POLICY IF EXISTS "Allow public update on admin_sessions" ON public.admin_sessions;
DROP POLICY IF EXISTS "Allow public delete on admin_sessions" ON public.admin_sessions;

-- Create RESTRICTIVE policies that block ALL public access
-- Access is only allowed via service_role key (used in Edge Functions)

-- Abandoned Carts: Block all public access
CREATE POLICY "Block public read on abandoned_carts" 
ON public.abandoned_carts 
AS RESTRICTIVE
FOR SELECT 
TO public
USING (false);

CREATE POLICY "Block public insert on abandoned_carts" 
ON public.abandoned_carts 
AS RESTRICTIVE
FOR INSERT 
TO public
WITH CHECK (false);

CREATE POLICY "Block public update on abandoned_carts" 
ON public.abandoned_carts 
AS RESTRICTIVE
FOR UPDATE 
TO public
USING (false);

CREATE POLICY "Block public delete on abandoned_carts" 
ON public.abandoned_carts 
AS RESTRICTIVE
FOR DELETE 
TO public
USING (false);

-- Admin Sessions: Block all public access
CREATE POLICY "Block public read on admin_sessions" 
ON public.admin_sessions 
AS RESTRICTIVE
FOR SELECT 
TO public
USING (false);

CREATE POLICY "Block public insert on admin_sessions" 
ON public.admin_sessions 
AS RESTRICTIVE
FOR INSERT 
TO public
WITH CHECK (false);

CREATE POLICY "Block public update on admin_sessions" 
ON public.admin_sessions 
AS RESTRICTIVE
FOR UPDATE 
TO public
USING (false);

CREATE POLICY "Block public delete on admin_sessions" 
ON public.admin_sessions 
AS RESTRICTIVE
FOR DELETE 
TO public
USING (false);