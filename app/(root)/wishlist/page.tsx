import ProductCart from "@/components/shared/product/product-cart";
import { getWishlistProducts } from "@/lib/actions/wishlist/wish.action";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const WishListPage = async () => {
  const wishlistItems = await getWishlistProducts();

  //convert the typeof rating and date to num and string
  const wishlistProducts = wishlistItems.map((item) => ({
    ...item.product,
    rating: Number(item.product.rating),
    createdAt: String(item.product.createdAt),
    isFavorite: true,
  }));

  if (wishlistItems.length === 0) {
    return (
      <div className="py-10 text-center">
        <h1 className="text-2xl font-bold">My Wishlist</h1>
        <p className="mt-4 text-muted-foreground">No items in your wishlist.</p>
        <Link
          href="/"
          className="text-green-500 py-2 px-5 rounded-md mt-4 inline-flex items-center gap-2 hover:underline"
        >
          Go shopping
          <ArrowRight />
        </Link>
      </div>
    );
  }

  return (
    <section className="py-10 px-4  text-center">
      <h1 className="mb-6 text-2xl font-bold">My Wishlist</h1>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {wishlistProducts.map((item) => (
          <div key={item.id}>
            <ProductCart product={item} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default WishListPage;
