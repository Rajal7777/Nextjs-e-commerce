'use client';

import ProductCart from "./product-cart";
import { ClientProduct } from "@/types";

const ProductList = ({ products, title, limit }: {
    products: ClientProduct[];
    title?: string;
    limit?: number;
}) => {
    const limitedData = limit ? products.slice(0, limit) : products;

    return (
        <div className="my-10">
            <h2 className="h2-bold mb-4">
                {title}
            </h2>
            {products.length === 0 && <p>No Products found</p>}
            {products.length > 0 && (
                <div className="mx-auto w-full max-w-90 sm:max-w-2xl lg:max-w-6xl grid grid-cols-2  sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 md:gap-4 gap-4 p-1">
                    {limitedData.map((product) => (
                        <ProductCart product={product} key={product.slug} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductList;