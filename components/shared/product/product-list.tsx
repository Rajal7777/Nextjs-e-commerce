"use client";

import { useSearchParams } from "next/navigation";
import ProductCart from "./product-cart";
import { ClientProduct } from "@/types";
import Pagination from "@/components/shared/pagination";

const ProductList = ({
  products,
  title,
  totalPages,
}: {
  products: ClientProduct[];
  title?: string;
  totalPages: number;
}) => {
  const searchParams = useSearchParams();

  const page = searchParams.get("page") || "1";

  const parsedPage = Number(page);

  const currentPage =
    Number.isFinite(parsedPage) && parsedPage > 0 ? Math.floor(parsedPage) : 1;

  return (
    <div className="my-10">
      <h2 className="h2-bold mb-4">{title}</h2>

      {products.length === 0 ? (
        <p>No Products found</p>
      ) : (
        <>
          <div className="mx-auto w-full max-w-90 sm:max-w-2xl lg:max-w-6xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-1">
            {products.map((product, index) => (
              <ProductCart
                product={product}
                key={product.slug}
                priority={index === 0}
              />
            ))}
          </div>

          {totalPages > 0 && (
            <div className="mt-8 flex justify-center">
              <Pagination
                page={currentPage}
                totalPages={totalPages}
                urlParamName="page"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductList;
