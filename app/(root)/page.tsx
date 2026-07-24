import ProductCarousel from '@/components/shared/product/product-carousel';
import ProductList from '@/components/shared/product/product-list';
import { getLatestProducts, getFeaturedProducts } from '@/lib/actions/product-actions';


const Homepage = async () => {
  const latestProducts = await getLatestProducts();
  const featuredProducts = await getFeaturedProducts();

  return (
    <div>
      <ProductCarousel products={featuredProducts} />
      <ProductList products={latestProducts} title='Products for this weekend' />
    </div>
  );
};

export default Homepage;


//.map(p => ({ ...p, rating: Number(p.rating) }))