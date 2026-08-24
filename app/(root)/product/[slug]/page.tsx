import { getProductBySLug } from "@/lib/actions/product-actions";
import { notFound } from "next/navigation";
import Price from "@/components/shared/product/price";
import ProductImages from "@/components/shared/product/product-image";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import AddToCart from "@/components/shared/product/addToCartBtn";
import { getMyCart } from "@/lib/actions/cart-actions";
import ReviewList from "./review-list";
import { auth } from "@/auth";
import Rating from "@/components/rating";
import WishlistButton from "@/components/shared/wishlist/wishlist-button";
import { getWishlistIds } from "@/lib/actions/wishlist/wish.action";
import { RefreshCw, Truck } from "lucide-react";

type ProductSlugProps = {
  params: Promise<{ slug: string; }>;
};

const ProductDetailsPage = async (props: ProductSlugProps) => {
  const { slug } = await props.params;

  const product = await getProductBySLug(slug);

  if (!product) notFound();

  const session = await auth();
  const userId = session?.user?.id;
  const [cart, wishlistIds] = await Promise.all([
    getMyCart(),
    getWishlistIds(),
  ]);
  const isFavorite = wishlistIds.includes(product.id);

  return (
    <div className="max-w-6xl mx-auto">
      <section className="container mx-auto mt-6  px-3 md:px-4">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-5 w-full">
          <div className="p-2.5 md:p-3 lg:col-span-3">
            <ProductImages images={product.images} />
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Badge variant="outline">{product.category}</Badge>
              <Badge variant="secondary">{product.brand}</Badge>
            </div>
            <p>{product.description}</p>
          </div>

          <div className="space-y-4 lg:col-span-2">
            <Card>
              <CardContent className="space-y-5 p-4 md:p-5">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                    {product.name}
                  </h1>

                  <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    <Rating
                      value={Number(product.rating)}
                      caption={`(${product.numReviews} Reviews)`}
                    />
                    <span>|</span>
                    <span>
                      {product.stock > 0 ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>

                  <div className="mt-4">
                    <Price
                      value={Number(product.price)}
                      className="text-3xl font-semibold md:text-4xl"
                    />
                  </div>
                </div>

                <p className="text-sm leading-7 text-foreground/90">
                  {product.description}
                </p>

                <div className="border-t pt-5">
                  <div className="flex items-center gap-3">
                    {product.stock > 0 && (
                      <div className="flex-1">
                        <AddToCart
                          cart={cart}
                          item={{
                            productId: product.id,
                            name: product.name,
                            slug: product.slug,
                            price: String(product.price),
                            qty: 1,
                            image: product.images[0],
                          }}
                        />
                      </div>
                    )}

                    <WishlistButton
                      productId={product.id}
                      initialIsFavorite={isFavorite}
                      className="static left-auto top-auto inline-flex h-10 w-10 shrink-0 rounded-md border bg-white text-gray-700 shadow-none hover:bg-gray-100"
                    />
                  </div>

                  <div className="mt-5 overflow-hidden rounded-lg border">
                    <div className="flex items-start gap-3 border-b p-3">
                      <Truck className="mt-1 h-5 w-5" />
                      <div>
                        <p className="font-semibold">Free Delivery</p>
                        <p className="text-sm text-muted-foreground">
                          Enter your postal code for delivery availability
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3">
                      <RefreshCw className="mt-1 h-5 w-5" />
                      <div>
                        <p className="font-semibold">Return Delivery</p>
                        <p className="text-sm text-muted-foreground">
                          Free 30 days delivery returns.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {product.stock <= 0 && (
                  <Badge variant="destructive" className="w-fit">
                    Out of stock
                  </Badge>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="container mx-auto mt-8 max-w-6xl px-3 md:px-4">
        <h2 className="h2-bold mb-4">Customer Reviews</h2>
        <ReviewList
          userId={userId || ""}
          productId={product.id}
          productSlug={product.slug}
        />
      </section>
    </div>
  );
};

export default ProductDetailsPage;
