import { useRef, useState, useEffect } from "react";
import ProductHeader from "@/components/shopee/ProductHeader";
import ProductGallery from "@/components/shopee/ProductGallery";
import ProductThumbnails from "@/components/shopee/ProductThumbnails";
import FlashSaleTimer from "@/components/shopee/FlashSaleTimer";
import ProductPrice from "@/components/shopee/ProductPrice";
import ProductTitle from "@/components/shopee/ProductTitle";
import ProductVariations, { ProductVariationsRef } from "@/components/shopee/ProductVariations";
import ProductShipping from "@/components/shopee/ProductShipping";
import StoreCard from "@/components/shopee/StoreCard";
import ProductDescription from "@/components/shopee/ProductDescription";
import ProductReviews from "@/components/shopee/ProductReviews";
import RelatedProducts from "@/components/shopee/RelatedProducts";
import ProductFooter from "@/components/shopee/ProductFooter";
import ProductPageFooter from "@/components/shopee/ProductPageFooter";
import ScrollToTopButton from "@/components/shopee/ScrollToTopButton";
import { useAbandonedCart } from "@/hooks/useAbandonedCart";
import { useMetaPixel } from "@/hooks/useMetaPixel";

const Index = () => {
  const variationsRef = useRef<ProductVariationsRef>(null);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const { trackViewContent } = useMetaPixel();
  
  // Initialize abandoned cart tracking (checks for stale carts on page load)
  useAbandonedCart();

  // Track ViewContent on page load
  useEffect(() => {
    trackViewContent(
      "AquaVolt - Prancha Elétrica Subaquática",
      "aquavolt-001",
      149700 // R$ 1.497,00 em centavos
    );
  }, [trackViewContent]);

  const handleNoColorSelected = () => {
    variationsRef.current?.scrollAndHighlight();
  };

  return (
    <div className="min-h-screen bg-background pb-14 max-w-md mx-auto">
      <ProductHeader />
      <ProductGallery currentIndex={galleryIndex} onIndexChange={setGalleryIndex} />
      <ProductThumbnails selectedIndex={galleryIndex} onSelect={setGalleryIndex} />
      <FlashSaleTimer />
      <ProductPrice />
      <ProductTitle />
      <ProductVariations ref={variationsRef} />
      <ProductShipping />
      <StoreCard />
      <ProductDescription />
      <ProductReviews />
      <RelatedProducts />
      <ProductPageFooter />
      <ProductFooter onNoColorSelected={handleNoColorSelected} />
      <ScrollToTopButton />
    </div>
  );
};

export default Index;
