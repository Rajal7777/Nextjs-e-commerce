import ProductCarousel from '@/components/shared/product/product-carousel';
import ProductList from '@/components/shared/product/product-list';
import { getLatestProducts, getFeaturedProducts } from '@/lib/actions/product-actions';
import {  getWishlistIds } from '@/lib/actions/wishlist/wish.action';
import ViewAllProductsButton from '@/components/view-all-products-button';
import IconBox from '@/components/iconBox';
import DealCountdown from '@/components/deal-countDown';


const Homepage = async () => {
  //for parallel fetching of data
  const [latestProducts, featuredProducts, wishlistIds] = await Promise.all([
    getLatestProducts(),
    getFeaturedProducts(),
    getWishlistIds(),
  ]);

 
  //we will use Set for faster lookup of product ids in the wishlist
  const wishListSet = new Set(wishlistIds);

  //add the isFavourite property to the products based on whether they are in the wishlist or not
  const latestProductsWithWishlist = latestProducts.map((product) => ({
    ...product,
    isFavorite: wishListSet.has(product.id),
  }));

  const featuredProductsWithWishlist = 
  featuredProducts.map((product) => ({
   ...product,
    isFavorite: wishListSet.has(product.id),
  }));


  return (
    <>
      <ProductCarousel products={featuredProductsWithWishlist} />
      <ProductList products={latestProductsWithWishlist} title='Products for this weekend' />
      <ViewAllProductsButton />
      <DealCountdown />
      <IconBox />
    </>
  );
};

export default Homepage;