import GenericProductPage from "./GenericProductPage";
import { newProducts } from "@/data/products";

const pages = newProducts.map((p) => ({
  slug: p.slug,
  Component: () => <GenericProductPage product={p} />,
}));

export default pages;
