import { lazy, Suspense, useEffect } from "react";
import ProductHeader from "@/components/shopee/ProductHeader";
import GenericProductGallery from "@/components/generic/GenericProductGallery";
import GenericProductPrice from "@/components/generic/GenericProductPrice";
import GenericProductTitle from "@/components/generic/GenericProductTitle";
import FlashSaleTimer from "@/components/shopee/FlashSaleTimer";
import ProductShipping from "@/components/shopee/ProductShipping";
import GenericProductFooter from "@/components/generic/GenericProductFooter";
import ScrollToTopButton from "@/components/shopee/ScrollToTopButton";
import LazySection from "@/components/ui/LazySection";
import { useCart } from "@/contexts/CartContext";
import { useMetaPixel } from "@/hooks/useMetaPixel";
import { useGoogleAnalytics } from "@/hooks/useGoogleAnalytics";
import type { ProductData } from "@/data/products";
import type { ProductType } from "@/contexts/CartContext";

const StoreCard = lazy(() => import("@/components/shopee/StoreCard"));
const GenericProductDescription = lazy(() => import("@/components/generic/GenericProductDescription"));
const GenericProductReviews = lazy(() => import("@/components/generic/GenericProductReviews"));
const GenericRelatedProducts = lazy(() => import("@/components/generic/GenericRelatedProducts"));
const ProductPageFooter = lazy(() => import("@/components/shopee/ProductPageFooter"));

const SectionFallback = () => (
  <div className="bg-card animate-pulse" style={{ minHeight: 120 }} />
);

interface Props {
  product: ProductData;
}

const GenericProductPage = ({ product }: Props) => {
  const { setProductType, setSelectedColor } = useCart();
  const { trackViewContent } = useMetaPixel();
  const { trackPageView, trackViewItem } = useGoogleAnalytics();

  useEffect(() => {
    setProductType(product.slug as ProductType);
    setSelectedColor(1);
    trackViewContent(product.name, product.id, Math.round(product.price * 100));
    trackPageView(`/${product.slug}`, `${product.shortName} - Produto`);
    trackViewItem(product.id, product.name, Math.round(product.price * 100));
  }, [product, setProductType, setSelectedColor, trackViewContent, trackPageView, trackViewItem]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto relative">
        <ProductHeader />
        <GenericProductGallery images={product.images} altPrefix={product.shortName} />
        <FlashSaleTimer />
        <GenericProductPrice price={product.price} originalPrice={product.originalPrice} installmentValue={product.installmentValue} />
        <GenericProductTitle title={product.name} soldCount={product.soldCount} rating={product.rating} ratingCount={product.ratingCount} />
        <ProductShipping />

        <LazySection rootMargin="300px" fallback={<SectionFallback />}>
          <Suspense fallback={<SectionFallback />}><StoreCard /></Suspense>
        </LazySection>

        <LazySection rootMargin="300px" fallback={<SectionFallback />}>
          <Suspense fallback={<SectionFallback />}>
            <GenericProductDescription specs={product.specs} description={product.description} bullets={product.descriptionBullets} images={product.images} productName={product.shortName} />
          </Suspense>
        </LazySection>

        <LazySection rootMargin="300px" fallback={<SectionFallback />}>
          <Suspense fallback={<SectionFallback />}>
            <GenericProductReviews rating={product.rating} reviewCount={product.reviewCount} reviews5Star={product.reviews5Star} reviews4Star={product.reviews4Star} reviews3Star={product.reviews3Star} />
          </Suspense>
        </LazySection>

        <LazySection rootMargin="300px" fallback={<SectionFallback />}>
          <Suspense fallback={<SectionFallback />}>
            <GenericRelatedProducts products={product.relatedProducts} productImage={product.images[0]} />
          </Suspense>
        </LazySection>

        <LazySection rootMargin="200px" fallback={<SectionFallback />}>
          <Suspense fallback={<SectionFallback />}><ProductPageFooter /></Suspense>
        </LazySection>
      </div>
      <GenericProductFooter productType={product.slug as ProductType} price={product.price} />
      <ScrollToTopButton />
    </div>
  );
};

export default GenericProductPage;
