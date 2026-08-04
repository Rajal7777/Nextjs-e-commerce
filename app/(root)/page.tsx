import ProductCarousel from '@/components/shared/product/product-carousel';
import ProductList from '@/components/shared/product/product-list';
import { getLatestProducts, getFeaturedProducts } from '@/lib/actions/product-actions';
import ViewAllProductsButton from '@/components/view-all-products-button';
import IconBox from '@/components/iconBox';


const Homepage = async () => {
  const latestProducts = await getLatestProducts();
  const featuredProducts = await getFeaturedProducts();

  return (
    <>
      <ProductCarousel products={featuredProducts} />
      <ProductList products={latestProducts} title='Products for this weekend' />
      <ViewAllProductsButton />
      <IconBox />
    </>
  );
};

export default Homepage;