import { ClientProduct } from '@/types';

const ProductCarousel = ({products} : {
    products: ClientProduct[];
}) => {
    return ( 
        <p>{products.length} featured products</p>
     );
}
 
export default ProductCarousel;