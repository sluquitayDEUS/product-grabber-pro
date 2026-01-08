-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create abandoned_carts table to store all abandoned cart data
CREATE TABLE public.abandoned_carts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('credit_card_attempt', 'checkout_abandoned')),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_document TEXT NOT NULL,
  customer_phone TEXT,
  shipping_street TEXT NOT NULL,
  shipping_number TEXT NOT NULL,
  shipping_complement TEXT,
  shipping_neighborhood TEXT NOT NULL,
  shipping_city TEXT NOT NULL,
  shipping_state TEXT NOT NULL,
  shipping_zipcode TEXT NOT NULL,
  product_name TEXT NOT NULL,
  product_quantity INTEGER NOT NULL DEFAULT 1,
  product_price DECIMAL(10,2) NOT NULL,
  total_amount INTEGER NOT NULL,
  contacted BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.abandoned_carts ENABLE ROW LEVEL SECURITY;

-- Create policy for service role only (edge functions)
CREATE POLICY "Service role can insert abandoned carts"
ON public.abandoned_carts
FOR INSERT
TO service_role
WITH CHECK (true);

-- Create policy for service role to select
CREATE POLICY "Service role can view abandoned carts"
ON public.abandoned_carts
FOR SELECT
TO service_role
USING (true);

-- Create policy for service role to update
CREATE POLICY "Service role can update abandoned carts"
ON public.abandoned_carts
FOR UPDATE
TO service_role
USING (true);

-- Create admin_sessions table for simple password auth
CREATE TABLE public.admin_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_token TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '24 hours')
);

-- Enable RLS
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;

-- Service role policies for admin_sessions
CREATE POLICY "Service role can manage admin sessions"
ON public.admin_sessions
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Create trigger for updated_at
CREATE TRIGGER update_abandoned_carts_updated_at
BEFORE UPDATE ON public.abandoned_carts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();