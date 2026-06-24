/*
props = {
  params: {
    slug: "iphone-16"
  }
}

props is an object containing a property called params, and that property is a Promise that resolves to an object having a string called slug.
(props: {
  params: Promise<{ slug: string }>;
})
*/
import { getProductBySLug } from '@/lib/actions/product.actions';
import { notFound } from 'next/navigation';
import Price from '@/components/shared/product/price';
import ProductImages from '@/components/shared/product/product-image'

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

type ProductSlugProps = {
    params: Promise<{ slug: string; }>;
};



const ProductDetailsPage = async (props: ProductSlugProps) => {
    const { slug } = await props.params;

    const product = await getProductBySLug(slug);

    if(!product) notFound();

    return (
       <section>
        <div className='grid grid-cols-1 md:grid-cols-5'>
            {/* Images column */}
            <div className='col-span-2'>
                <ProductImages images={product.images}/>
                </div>

            {/* Detail column */}
            <div className='col-span-2 p-5'>
                <div className='flex flex-col gap-6'>
                    <p>{product.brand} {product.category}</p>
                    <h1 className="h3-bold">{product.name}</h1>
                    <p>
                        {product.rating.toString()} of {product.numReviews} Reviews
                    </p>
                    <div className='flex flex-col sm:flex-row sm:items-center gap-3'>
                        <Price value={Number(product.price)} className='w-24 rounded-full bg-green-100 px-5 py-2 text-center'/>
                    </div>
                </div>
                <div className='mt-10'>
                    <p className='font-semibold'>Description</p>
                    <p>{product.description}</p>
                </div>
            </div>

            {/* Action Column */}
            <div>
                <Card>
                    <CardContent className='p-4'>
                            <div className='flex justify-between items-center mb-2'>
                                <div>Price</div>
                                <div>
                                    <Price  value={Number(product.price)}/>
                                </div>
                            </div>

                            <div className='flex justify-between mb-2'>
                                <div>Status</div>
                                {product.stock > 0 ? (
                                    <Badge variant='outline'>In stock</Badge>
                                ): (<Badge variant='destructive'>Out of stock</Badge>)}
                            </div>

                            {product.stock > 0 && (
                                <div className='flex-center'>
                                    <Button className='w-full'>Add to cart</Button>
                                </div>
                            )}
                    </CardContent>
                </Card>
            </div>

        </div>
       </section>
    );
};

export default ProductDetailsPage;


