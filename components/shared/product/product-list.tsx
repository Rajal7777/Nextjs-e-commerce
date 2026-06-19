'use client'

const ProductList = ({ products, title, limit }: { products: any; title?: string; limit?: number; }) => {
const limitedData = limit ? products.slice(0, limit) : products;

    return (
        <div className="my-10">
            <h2 className="h2-bold mb-4">
                {title}
            </h2>
            {products.length < 0 && <p>No Products found</p>}
            {products.length >0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {limitedData.map((product: any) => (
                        <div key={product.name}>{product.name}</div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ProductList;