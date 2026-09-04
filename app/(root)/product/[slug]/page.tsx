import { getProductBySlug } from "@/lib/actions/product/product-actions";
import { notFound } from "next/navigation";
import Price from "@/components/shared/product/price";
import ProductImages from "@/components/shared/product/product-image";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import AddToCart from "@/components/shared/product/addToCartBtn";
import { getMyCart } from "@/lib/actions/cart/cart-actions";
import ReviewList from "./review-list";
import { auth } from "@/auth";
import Rating from "@/components/rating";
import WishlistButton from "@/components/shared/wishlist/wishlist-button";
import { getWishlistIds } from "@/lib/actions/wishlist/wish.action";
import { RefreshCw, Truck } from "lucide-react";
import { Metadata } from "next";
import { Suspense } from "react";



type ProductSlugProps = {
  params: Promise<{ slug: string; }>;
};

//SEO optimization 
export async function generateMetadata({ params }: ProductSlugProps): Promise<Metadata> {
  const { slug } = await params;

  if (!slug || !/^[a-zA-Z0-9-]+$/.test(slug)) return { title: "Product Not Found" };

  const product = await getProductBySlug(slug);
  
  if (!product) return { title: "Product Not Found" };
  return { title: `${product.name} - Store`, description: product.description };
}

const ProductDetailsPage = async (props: ProductSlugProps) => {
  const { slug } = await props.params;

  //validate slug
  if (
    !slug ||
    typeof slug !== "string" ||
    slug.length > 100 ||
    !/^[a-zA-Z0-9-]+$/.test(slug)
  ) {
    notFound();
  }

  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const [session, cart, wishlistIds] = await Promise.all([
    auth(),
    getMyCart(),
    getWishlistIds(),
  ]);

  const userId = session?.user?.id ;

  const isFavorite = wishlistIds.includes(product.id) ?? false;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <section className="w-full">
        {/* Product Details Section */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12 items-start w-full">
          {/* Left Side */}
          <div className="w-full md:col-span-7 space-y-4">
            <ProductImages images={product.images} />
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">{product.category}</Badge>
              <Badge variant="secondary">{product.brand}</Badge>
            </div>
          </div>

          {/* Right Side*/}
          <div className="w-full md:col-span-5 space-y-4">
            <Card className="h-full border-muted/60 shadow-sm">
              <CardContent className="space-y-5 p-5 md:p-6">
                <div>
                  <h1 className="text-xl font-bold tracking-tight md:text-3xl text-foreground">
                    {product.name}
                  </h1>

                  <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    <Rating
                      value={Number(product.rating)}
                      caption={`(${product.numReviews} Reviews)`}
                    />
                    <span>|</span>
                    <span
                      className={
                        product.stock > 0
                          ? "text-emerald-600 font-medium"
                          : "text-destructive font-medium"
                      }
                    >
                      {product.stock > 0 ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>

                  <div className="mt-4">
                    <Price
                      value={Number(product.price)}
                      className="text-xl font-semibold md:text-3xl text-foreground"
                    />
                  </div>
                </div>

                <p className="text-sm leading-relaxed text-muted-foreground">
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
                            price:
                              String(product.price) ?? "/images/store-icon.jpg",
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

                  <div className="mt-5 overflow-hidden rounded-lg border border-muted/60">
                    <div className="flex items-start gap-3 border-b border-muted/60 p-3.5">
                      <Truck className="mt-0.5 h-5 w-5 text-muted-foreground shrink-0" />
                      <div>
                        <p className="text-sm font-semibold">Free Delivery</p>
                        <p className="text-xs text-muted-foreground">
                          Enter your postal code for delivery availability
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3.5">
                      <RefreshCw className="mt-0.5 h-5 w-5 text-muted-foreground shrink-0" />
                      <div>
                        <p className="text-sm font-semibold">Return Delivery</p>
                        <p className="text-xs text-muted-foreground">
                          Free 30 days delivery returns.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {product.stock <= 0 && (
                  <Badge
                    variant="destructive"
                    className="w-full justify-center py-1.5 text-sm"
                  >
                    Out of stock
                  </Badge>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Review Section spacing optimization */}
      <section className="mt-12 border-t pt-8 w-full">
        <h2 className="text-xl font-bold tracking-tight md:text-2xl mb-6 text-foreground">
          Customer Reviews
        </h2>

        <Suspense fallback={<p>Loading Reviews...</p>}>
          <ReviewList
            productId={product.id}
            productSlug={product.slug}
            userId={userId}
          />
        </Suspense>
      </section>
    </div>
  );
};

export default ProductDetailsPage;
