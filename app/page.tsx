import sampleData from '@/db/sample-data';
import ProductList from '@/components/shared/product/product-list';

const Homepage = () => {
  return (
    <div>
   <ProductList products={sampleData.products} title='Products for this weekend' limit={4}/>
    </div>
  );
};

export default Homepage;