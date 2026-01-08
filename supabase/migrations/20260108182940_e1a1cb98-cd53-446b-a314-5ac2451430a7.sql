-- Fix RLS policies for abandoned_carts table
-- Remove existing policies
DROP POLICY IF EXISTS "Service role can insert abandoned carts" ON public.abandoned_carts;
DROP POLICY IF EXISTS "Service role can update abandoned carts" ON public.abandoned_carts;
DROP POLICY IF EXISTS "Service role can view abandoned carts" ON public.abandoned_carts;

-- Create proper restrictive policies (service role bypasses RLS, these block public access)
CREATE POLICY "No public access to abandoned carts"
ON public.abandoned_carts
FOR ALL
USING (false)
WITH CHECK (false);

-- Add DELETE policy for service role cleanup (service role bypasses RLS anyway)
-- This effectively blocks all public access while service role can still operate

-- Fix RLS policies for admin_sessions table
DROP POLICY IF EXISTS "Service role can manage admin sessions" ON public.admin_sessions;

-- Create proper restrictive policy
CREATE POLICY "No public access to admin sessions"
ON public.admin_sessions
FOR ALL
USING (false)
WITH CHECK (false);