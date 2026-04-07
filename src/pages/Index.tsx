import { useRef, useState, useEffect, lazy, Suspense } from "react";
import { useCart } from "@/contexts/CartContext";
import ProductHeader from "@/components/shopee/ProductHeader";
import ProductGallery from "@/components/shopee/ProductGallery";
import ProductPrice from "@/components/shopee/ProductPrice";
import ProductTitle from "@/components/shopee/ProductTitle";
import FlashSaleTimer from "@/components/shopee/FlashSaleTimer";
import ProductVariations, { ProductVariationsRef } from "@/components/shopee/ProductVariations";
import ProductShipping from "@/components/shopee/ProductShipping";
import ProductFooter from "@/components/shopee/ProductFooter";
import ScrollToTopButton from "@/components/shopee/ScrollToTopButton";
import LazySection from "@/components/ui/LazySection";
import { useMetaPixel } from "@/hooks/useMetaPixel";
import { useGoogleAnalytics } from "@/hooks/useGoogleAnalytics";

// Lazy load heavy below-fold components
const StoreCard = lazy(() => import("@/components/shopee/StoreCard"));
const ProductDescription = lazy(() => import("@/components/shopee/ProductDescription"));
const ProductReviews = lazy(() => import("@/components/shopee/ProductReviews"));
const RelatedProducts = lazy(() => import("@/components/shopee/RelatedProducts"));
const ProductPageFooter = lazy(() => import("@/components/shopee/ProductPageFooter"));

const SectionFallback = () => (
  <div className="bg-card animate-pulse" style={{ minHeight: 120 }} />
);

const Index = () => {
  const variationsRef = useRef<ProductVariationsRef>(null);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const { trackViewContent } = useMetaPixel();
  const { trackPageView, trackViewItem } = useGoogleAnalytics();
  const { setProductType } = useCart();
  
  useEffect(() => {
    setProductType("aquavolt");
    
    trackViewContent(
      "AquaVolt - Prancha Elétrica Subaquática",
      "aquavolt-001",
      149700
    );
    trackPageView("/", "AquaVolt - Produto");
    trackViewItem(
      "aquavolt-001",
      "AquaVolt - Prancha Elétrica Subaquática",
      149700
    );
  }, [trackViewContent, trackPageView, trackViewItem, setProductType]);

  const handleNoColorSelected = () => {
    variationsRef.current?.scrollAndHighlight();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto relative">
        <ProductHeader />
        <ProductGallery currentIndex={galleryIndex} onIndexChange={setGalleryIndex} />
        <ProductVariations ref={variationsRef} />
        <FlashSaleTimer />
        <ProductPrice />
        <ProductTitle />
        <ProductShipping />
        
        <LazySection rootMargin="300px" fallback={<SectionFallback />}>
          <Suspense fallback={<SectionFallback />}>
            <StoreCard />
          </Suspense>
        </LazySection>

        <LazySection rootMargin="300px" fallback={<SectionFallback />}>
          <Suspense fallback={<SectionFallback />}>
            <ProductDescription />
          </Suspense>
        </LazySection>

        <LazySection rootMargin="300px" fallback={<SectionFallback />}>
          <Suspense fallback={<SectionFallback />}>
            <ProductReviews />
          </Suspense>
        </LazySection>

        <LazySection rootMargin="200px" fallback={<SectionFallback />}>
          <Suspense fallback={<SectionFallback />}>
            <RelatedProducts />
          </Suspense>
        </LazySection>

        <LazySection rootMargin="200px" fallback={<SectionFallback />}>
          <Suspense fallback={<SectionFallback />}>
            <ProductPageFooter />
          </Suspense>
        </LazySection>
      </div>
      <ProductFooter onNoColorSelected={handleNoColorSelected} />
      <ScrollToTopButton />
    </div>
  );
};

export default Index;
