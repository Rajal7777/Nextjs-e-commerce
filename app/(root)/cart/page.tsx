import CartTable from "./cart-table";
import { getMyCart } from "@/lib/actions/cart-actions";
import { getWishlistIds } from "@/lib/actions/wishlist/wish.action";

export const metadata = {
  title: "Shopping Cart",
};

const CartPage = async () => {
  const cart = await getMyCart();
  const wishlistIds = await getWishlistIds();

  return (
    <div>
      <CartTable cart={cart} />
    </div>
  );
};

export default CartPage;
