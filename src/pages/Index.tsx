import { useRef, useState, useEffect, lazy, Suspense } from "react";
import ProductHeader from "@/components/shopee/ProductHeader";
import ProductGallery from "@/components/shopee/ProductGallery";
import ProductPrice from "@/components/shopee/ProductPrice";
import ProductTitle from "@/components/shopee/ProductTitle";
import FlashSaleTimer from "@/components/shopee/FlashSaleTimer";
import ProductVariations, { ProductVariationsRef } from "@/components/shopee/ProductVariations";
import ProductShipping from "@/components/shopee/ProductShipping";

// Lazy load below-fold components to reduce initial JS
const StoreCard = lazy(() => import("@/components/shopee/StoreCard"));
const ProductDescription = lazy(() => import("@/components/shopee/ProductDescription"));
const ProductReviews = lazy(() => import("@/components/shopee/ProductReviews"));
const RelatedProducts = lazy(() => import("@/components/shopee/RelatedProducts"));
const ProductFooter = lazy(() => import("@/components/shopee/ProductFooter"));
const ProductPageFooter = lazy(() => import("@/components/shopee/ProductPageFooter"));
const ScrollToTopButton = lazy(() => import("@/components/shopee/ScrollToTopButton"));
import { useAbandonedCart } from "@/hooks/useAbandonedCart";
import { useMetaPixel } from "@/hooks/useMetaPixel";
import { useGoogleAnalytics } from "@/hooks/useGoogleAnalytics";

const Index = () => {
  const variationsRef = useRef<ProductVariationsRef>(null);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const { trackViewContent } = useMetaPixel();
  const { trackPageView, trackViewItem } = useGoogleAnalytics();
  
  // Initialize abandoned cart tracking (checks for stale carts on page load)
  useAbandonedCart();

  // Track ViewContent on page load
  useEffect(() => {
    // Meta Pixel tracking
    trackViewContent(
      "AquaVolt - Prancha Elétrica Subaquática",
      "aquavolt-001",
      149700 // R$ 1.497,00 em centavos
    );
    
    // Google Analytics tracking
    trackPageView("/", "AquaVolt - Produto");
    trackViewItem(
      "aquavolt-001",
      "AquaVolt - Prancha Elétrica Subaquática",
      149700
    );
  }, [trackViewContent, trackPageView, trackViewItem]);

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
        <Suspense fallback={<div className="h-40" />}>
          <StoreCard />
          <ProductDescription />
          <ProductReviews />
          <RelatedProducts />
          <ProductPageFooter />
        </Suspense>
      </div>
      <Suspense fallback={null}>
        <ProductFooter onNoColorSelected={handleNoColorSelected} />
        <ScrollToTopButton />
      </Suspense>
    </div>
  );
};

export default Index;
