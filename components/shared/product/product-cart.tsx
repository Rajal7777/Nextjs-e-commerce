import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import Price from "./price";
import { ClientProduct } from "@/types";
import Rating from "@/components/rating";
import {  ShoppingCart } from "lucide-react";
import WishlistButton from "../wishlist/wishlist-button";


const ProductCart = ({ product }: { product: ClientProduct }) => {
  console.log(product)
  return (
    <Card
      size="sm"
      className=" group flex h-full w-[45vw] sm:w-full flex-col overflow-hidden rounded-2xl border bg-white  p-0 shadow-sm transition-all  duration-300 ease-in-out :-translate-y-1 :shadow-lg 
 my-10 "
    >
      <CardHeader className="p-0 border">
        <div className="relative h-44 w-full overflow-hidden bg-gray-50 sm:h-52 lg:h-56">
          <Link
            href={`/product/${product.slug}`}
            className="relative block aspect-square w-full"
          >
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, 35vw"
              priority
            />
          </Link>
{/* in case of undefined the value will be false */}
  <WishlistButton productId={product.id} initialIsFavorite={product.isFavorite ?? false} />

          <button
            type="button"
            aria-label="Add to cart"
            className="absolute bottom-2 left-1/2 inline-flex -translate-x-1/2 items-center gap-2 rounded-full bg-gray-600 px-3 py-2 text-white opacity-100 shadow-lg transition-all duration-300 hover:bg-gray-700 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 sm:bottom-3 sm:px-4"
          >
            <ShoppingCart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </button>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col justify-between px-3 pb-4 pt-3 text-center sm:px-4">
        <Link
          href={`/product/${product.slug}`}
          className="line-clamp-2 min-h-10 text-sm font-semibold leading-5 hover:underline sm:min-h-12 sm:text-base"
        >
          {product.name}
        </Link>

        <div className="min-h-4 text-[11px] text-muted-foreground sm:text-xs">
          {product.brand}
        </div>

        <div className="flex min-h-11 flex-col items-center justify-end gap-1">
          <Rating
            value={Number(product.rating)}
            caption={`${Number(product.rating).toFixed(1)}`}
          />
          {product.stock > 0 ? (
            <Price value={Number(product.price)} />
          ) : (
            <p className="text-sm text-destructive">Out of stock</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCart;
