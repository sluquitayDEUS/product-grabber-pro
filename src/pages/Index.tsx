import ProductHeader from "@/components/shopee/ProductHeader";
import ProductGallery from "@/components/shopee/ProductGallery";
import ProductPrice from "@/components/shopee/ProductPrice";
import ProductTitle from "@/components/shopee/ProductTitle";
import ProductVariations from "@/components/shopee/ProductVariations";
import ProductShipping from "@/components/shopee/ProductShipping";
import StoreCard from "@/components/shopee/StoreCard";
import ProductDescription from "@/components/shopee/ProductDescription";
import ProductReviews from "@/components/shopee/ProductReviews";
import RelatedProducts from "@/components/shopee/RelatedProducts";
import ProductFooter from "@/components/shopee/ProductFooter";

const Index = () => {
  return (
    <div className="min-h-screen bg-background pb-14 max-w-md mx-auto">
      <ProductHeader />
      <ProductGallery />
      <ProductPrice />
      <ProductTitle />
      <ProductVariations />
      <ProductShipping />
      <StoreCard />
      <ProductDescription />
      <ProductReviews />
      <RelatedProducts />
      <ProductFooter />
    </div>
  );
};

export default Index;