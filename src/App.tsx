import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import ScrollToTop from "./components/ScrollToTop";
import Index from "./pages/Index";
import { newProducts } from "./data/products";

const Checkout = lazy(() => import("./pages/Checkout"));
const PixPayment = lazy(() => import("./pages/PixPayment"));
const OrderSuccess = lazy(() => import("./pages/OrderSuccess"));
const PoliticaPrivacidade = lazy(() => import("./pages/PoliticaPrivacidade"));
const TermosCondicoes = lazy(() => import("./pages/TermosCondicoes"));
const PoliticaReembolso = lazy(() => import("./pages/PoliticaReembolso"));
const Relogio = lazy(() => import("./pages/Relogio"));
const Produtos = lazy(() => import("./pages/Produtos"));
const GenericProductPage = lazy(() => import("./pages/GenericProductPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const LazyFallback = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
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
          <Suspense fallback={<LazyFallback />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/relogio" element={<Relogio />} />
              <Route path="/produtos" element={<Produtos />} />
              {newProducts.map((p) => (
                <Route key={p.slug} path={`/${p.slug}`} element={<GenericProductPage product={p} />} />
              ))}
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/pix-payment" element={<PixPayment />} />
              <Route path="/order-success" element={<OrderSuccess />} />
              <Route path="/politica-privacidade" element={<PoliticaPrivacidade />} />
              <Route path="/termos-condicoes" element={<TermosCondicoes />} />
              <Route path="/politica-reembolso" element={<PoliticaReembolso />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
