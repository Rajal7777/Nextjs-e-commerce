import ProductCarousel from "@/components/shared/product/product-carousel";
import ProductList from "@/components/shared/product/product-list";
import {
  getFeaturedProducts,
  getAllProducts,
} from "@/lib/actions/product-actions";
import { getWishlistIds } from "@/lib/actions/wishlist/wish.action";
import ViewAllProductsButton from "@/components/view-all-products-button";
import IconBox from "@/components/iconBox";
import DealCountdown from "@/components/deal-countDown";

type HomepageProps = {
  searchParams: Promise<{ page?: string }>;
};

const Homepage = async ({ searchParams }: HomepageProps) => {
  const params = await searchParams;
  const page = Number(params.page) || 1;

  // Fetch paginated products and metadata together
  const [{ data: latestProducts, totalPages }, featuredProducts, wishlistIds] =
    await Promise.all([
      getAllProducts({ page }),
      getFeaturedProducts(),
      getWishlistIds(),
    ]);

  const wishListSet = new Set(wishlistIds);

  const latestProductsWithWishlist = latestProducts.map((product) => ({
    ...product,
    isFavorite: wishListSet.has(product.id),
  }));

  const featuredProductsWithWishlist = featuredProducts.map((product) => ({
    ...product,
    isFavorite: wishListSet.has(product.id),
  }));

  return (
    <>
      <ProductCarousel products={featuredProductsWithWishlist} />
      <ProductList
        products={latestProductsWithWishlist}
        title="Products for this weekend"
        totalPages={totalPages}
      />
      <ViewAllProductsButton />
      <DealCountdown />
      <IconBox />
    </>
  );
};

export default Homepage;
