import CartTable from "./cart-page";
import { getMyCart } from "@/lib/actions/cart/cart-actions";


export const metadata = {
  title: "Shopping Cart",
};

const CartPage = async () => {
  const cart = await getMyCart();


  return (
    <CartTable cart={cart} />
  );
};

export default CartPage;
