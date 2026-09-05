import ProductCart from "@/components/shared/product/product-cart";
import { getWishlistProducts } from "@/lib/actions/wishlist/wish.action";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ArrowRight, Heart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const WishListPage = async () => {
  // Guests must sign in before viewing their wishlist
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/sign-in?callbackUrl=/wishlist");
  }

  const wishlistItems = await getWishlistProducts();

  // Convert the typeof rating and date to number and string respectively
  const wishlistProducts = wishlistItems.map((item) => ({
    ...item.product,
    rating: Number(item.product.rating),
    createdAt: String(item.product.createdAt),
    isFavorite: true,
  }));

  if (wishlistItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="rounded-full bg-muted p-4 text-muted-foreground mb-3">
          <Heart className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Your wishlist is empty</h1>
        <p className="mt-2 text-sm text-muted-foreground max-w-sm">
          Explore our items and save your favorites to view them anytime here.
        </p>
        <Button asChild className="mt-6 gap-2">
          <Link href="/search">
            Go shopping
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <section className="py-8 space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          My Wishlist ({wishlistProducts.length})
        </h1>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {wishlistProducts.map((product) => (
          <div key={product.id} className="h-full">
            <ProductCart product={product} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default WishListPage;
