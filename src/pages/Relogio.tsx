import { lazy, Suspense, useEffect } from "react";
import ProductHeader from "@/components/shopee/ProductHeader";
import WatchGallery from "@/components/relogio/WatchGallery";
import WatchPrice from "@/components/relogio/WatchPrice";
import WatchTitle from "@/components/relogio/WatchTitle";
import FlashSaleTimer from "@/components/shopee/FlashSaleTimer";
import ProductShipping from "@/components/shopee/ProductShipping";
import WatchFooter from "@/components/relogio/WatchFooter";
import ScrollToTopButton from "@/components/shopee/ScrollToTopButton";
import LazySection from "@/components/ui/LazySection";
import { useCart } from "@/contexts/CartContext";
import { useMetaPixel } from "@/hooks/useMetaPixel";
import { useGoogleAnalytics } from "@/hooks/useGoogleAnalytics";

const StoreCard = lazy(() => import("@/components/shopee/StoreCard"));
const WatchDescription = lazy(() => import("@/components/relogio/WatchDescription"));
const WatchReviews = lazy(() => import("@/components/relogio/WatchReviews"));
const WatchRelatedProducts = lazy(() => import("@/components/relogio/WatchRelatedProducts"));
const ProductPageFooter = lazy(() => import("@/components/shopee/ProductPageFooter"));

const SectionFallback = () => (
  <div className="bg-card animate-pulse" style={{ minHeight: 120 }} />
);

const Relogio = () => {
  const { setProductType, setSelectedColor } = useCart();
  const { trackViewContent } = useMetaPixel();
  const { trackPageView, trackViewItem } = useGoogleAnalytics();

  useEffect(() => {
    setProductType("relogio");
    setSelectedColor(1); // Auto-select the only variation
    
    trackViewContent("Relógio Imperium - Linha Suíça Premium A+", "relogio-imperium-001", 18790);
    trackPageView("/relogio", "Relógio Imperium - Produto");
    trackViewItem("relogio-imperium-001", "Relógio Imperium - Linha Suíça Premium A+", 18790);
  }, [setProductType, setSelectedColor, trackViewContent, trackPageView, trackViewItem]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto relative">
        <ProductHeader />
        <WatchGallery />
        <FlashSaleTimer />
        <WatchPrice />
        <WatchTitle />
        <ProductShipping />

        <LazySection rootMargin="300px" fallback={<SectionFallback />}>
          <Suspense fallback={<SectionFallback />}>
            <StoreCard />
          </Suspense>
        </LazySection>

        <LazySection rootMargin="300px" fallback={<SectionFallback />}>
          <Suspense fallback={<SectionFallback />}>
            <WatchDescription />
          </Suspense>
        </LazySection>

        <LazySection rootMargin="300px" fallback={<SectionFallback />}>
          <Suspense fallback={<SectionFallback />}>
            <WatchReviews />
          </Suspense>
        </LazySection>

        <LazySection rootMargin="300px" fallback={<SectionFallback />}>
          <Suspense fallback={<SectionFallback />}>
            <WatchRelatedProducts />
          </Suspense>
        </LazySection>

        <LazySection rootMargin="200px" fallback={<SectionFallback />}>
          <Suspense fallback={<SectionFallback />}>
            <ProductPageFooter />
          </Suspense>
        </LazySection>
      </div>
      <WatchFooter />
      <ScrollToTopButton />
    </div>
  );
};

export default Relogio;
