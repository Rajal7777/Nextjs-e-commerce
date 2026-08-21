import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import Price from "./price";
import { ClientProduct } from "@/types";
import Rating from "@/components/rating";
import WishlistButton from "../wishlist/wishlist-button";
import AddToCart from "./addToCartBtn";

const ProductCart = ({
  product,
  priority = false,
}: {
  product: ClientProduct;
  priority?: boolean;
}) => {
//fallback img
const productImage = product.images[0] || "/images/loader.jpg";
  return (
    <Card
      size="sm"
      className="group mx-auto flex h-full w-full flex-col overflow-hidden rounded-2xl p-0"
    >
      <CardHeader className="p-0 shrink-0">
        <div className="relative aspect-square w-full overflow-hidden rounded-t-2xl bg-gray-100 sm:aspect-4/3">
          <Link
            href={`/product/${product.slug}`}
            className="relative block h-full w-full"
          >
            <Image
              src={productImage}
              alt={product.name}
              fill
              className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              priority={priority}
            />
          </Link>

          {/* in case of undefined the value will be false */}
          <WishlistButton
            productId={product.id}
            initialIsFavorite={product.isFavorite ?? false}
          />

          {/* Add to cart button */}
          <AddToCart
            iconOnly
            disabled={product.stock <= 0}
            item={{
              productId: product.id,
              name: product.name,
              slug: product.slug,
              price: String(product.price),
              image: productImage,
              qty: 1,
            }}
          />
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col  text-center">
        <Link
          href={`/product/${product.slug}`}
          className="line-clamp-2 text-sm font-semibold leading-5 hover:underline sm:min-h-12 sm:text-base"
        >
          {product.name}
        </Link>

        <div className=" text-[11px] text-muted-foreground sm:text-xs">
          {product.brand}
        </div>

        <div className="flex min-h-11 flex-col items-center justify-end gap-1">
          <Rating
            value={Number(product.rating)}
            caption={`${Number(product.rating).toFixed(1)}`}
          />
         {product.stock > 0 && (
            <Price value={Number(product.price)} />
          )}
          {product.stock <= 0 && (
            <span className="text-xs font-semibold text-red-600">
              Out of Stock
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCart;
