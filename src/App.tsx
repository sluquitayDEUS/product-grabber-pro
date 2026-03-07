import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import ScrollToTop from "./components/ScrollToTop";
import { lazy, Suspense } from "react";

// Eagerly load the main page (critical path)
import Index from "./pages/Index";

// Lazy load all other routes
const Checkout = lazy(() => import("./pages/Checkout"));
const PixPayment = lazy(() => import("./pages/PixPayment"));
const OrderSuccess = lazy(() => import("./pages/OrderSuccess"));
const AdminPanel = lazy(() => import("./pages/AdminPanel"));
const PoliticaPrivacidade = lazy(() => import("./pages/PoliticaPrivacidade"));
const TermosCondicoes = lazy(() => import("./pages/TermosCondicoes"));
const PoliticaReembolso = lazy(() => import("./pages/PoliticaReembolso"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 min
      gcTime: 10 * 60 * 1000, // 10 min
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/pix-payment" element={<PixPayment />} />
              <Route path="/order-success" element={<OrderSuccess />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/politica-privacidade" element={<PoliticaPrivacidade />} />
              <Route path="/termos-condicoes" element={<TermosCondicoes />} />
              <Route path="/politica-reembolso" element={<PoliticaReembolso />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
