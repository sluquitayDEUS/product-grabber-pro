import { useRef } from "react";
import ProductHeader from "@/components/shopee/ProductHeader";
import ProductGallery from "@/components/shopee/ProductGallery";
import ProductPrice from "@/components/shopee/ProductPrice";
import ProductTitle from "@/components/shopee/ProductTitle";
import ProductVariations, { ProductVariationsRef } from "@/components/shopee/ProductVariations";
import ProductShipping from "@/components/shopee/ProductShipping";
import StoreCard from "@/components/shopee/StoreCard";
import ProductDescription from "@/components/shopee/ProductDescription";
import ProductReviews from "@/components/shopee/ProductReviews";
import RelatedProducts from "@/components/shopee/RelatedProducts";
import ProductFooter from "@/components/shopee/ProductFooter";

const Index = () => {
  const variationsRef = useRef<ProductVariationsRef>(null);

  const handleNoColorSelected = () => {
    variationsRef.current?.scrollAndHighlight();
  };

  return (
    <div className="min-h-screen bg-background pb-14 max-w-md mx-auto">
      <ProductHeader />
      <ProductGallery />
      <ProductPrice />
      <ProductTitle />
      <ProductVariations ref={variationsRef} />
      <ProductShipping />
      <StoreCard />
      <ProductDescription />
      <ProductReviews />
      <RelatedProducts />
      <ProductFooter onNoColorSelected={handleNoColorSelected} />
    </div>
  );
};

export default Index;
