import { useRef, useState } from "react";
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
import ScrollToTopButton from "@/components/shopee/ScrollToTopButton";

const Index = () => {
  const variationsRef = useRef<ProductVariationsRef>(null);
  const [galleryIndex, setGalleryIndex] = useState(0);

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
      <ProductFooter onNoColorSelected={handleNoColorSelected} />
      <ScrollToTopButton />
    </div>
  );
};

export default Index;
