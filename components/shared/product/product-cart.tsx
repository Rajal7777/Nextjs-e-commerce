import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import Price from "./price";
import { ClientProduct } from "@/types";
import Rating from "@/components/rating";
import { Heart, ShoppingCart } from "lucide-react";

const ProductCart = ({ product }: { product: ClientProduct; }) => {
    return (
        <Card
            size="sm"
            className="group mx-auto w-full max-w-sm overflow-hidden rounded-2xl border bg-white p-0 shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg"
        >
            <CardHeader className="p-0">
                <div className="relative aspect-square w-full overflow-hidden bg-gray-50">
                    <Link href={`/product/${product.slug}`} className="block h-full w-full">
                        <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 640px) 100vw, 320px"
                            priority
                        />
                    </Link>

                    <button
                        type="button"
                        aria-label="Add to wishlist"
                        className="absolute left-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full border bg-white/95 text-gray-700 shadow-sm transition-colors hover:bg-red-400 sm:left-3 sm:top-3 sm:h-9 sm:w-9"
                    >
                        <Heart className="h-3 w-3 sm:h-4 sm:w-4" />
                    </button>

                    <button
                        type="button"
                        aria-label="Add to cart"
                        className="absolute bottom-2 left-1/2 inline-flex -translate-x-1/2 items-center gap-2 rounded-full bg-black px-3 py-2  text-white opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 sm:bottom-3 sm:px-4 hover:bg-gray-700"
                    >
                        <ShoppingCart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </button>
                </div>
            </CardHeader>

            <CardContent className="grid gap-1 px-3 pb-4  text-center sm:px-4 sm:gap-2">

                <Link href={`/product/${product.slug}`} className="line-clamp-2 text-sm font-semibold leading-5 hover:underline sm:text-base">
                    {product.name}
                </Link>

                <div className="text-[11px] text-muted-foreground sm:text-xs">{product.brand}</div>


                <div className="flex flex-col items-center gap-1">
                    <Rating value={Number(product.rating)} caption={`${Number(product.rating).toFixed(1)}`} />
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
