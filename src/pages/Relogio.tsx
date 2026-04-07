import { lazy, Suspense } from "react";
import ProductHeader from "@/components/shopee/ProductHeader";
import WatchGallery from "@/components/relogio/WatchGallery";
import WatchPrice from "@/components/relogio/WatchPrice";
import WatchTitle from "@/components/relogio/WatchTitle";
import FlashSaleTimer from "@/components/shopee/FlashSaleTimer";
import ProductShipping from "@/components/shopee/ProductShipping";
import WatchFooter from "@/components/relogio/WatchFooter";
import ScrollToTopButton from "@/components/shopee/ScrollToTopButton";
import LazySection from "@/components/ui/LazySection";

const StoreCard = lazy(() => import("@/components/shopee/StoreCard"));
const WatchDescription = lazy(() => import("@/components/relogio/WatchDescription"));
const WatchReviews = lazy(() => import("@/components/relogio/WatchReviews"));
const ProductPageFooter = lazy(() => import("@/components/shopee/ProductPageFooter"));

const SectionFallback = () => (
  <div className="bg-card animate-pulse" style={{ minHeight: 120 }} />
);

const Relogio = () => {
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
