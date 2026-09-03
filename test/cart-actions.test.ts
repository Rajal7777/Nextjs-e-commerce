import {
  removeItemFromCart,
  removeItemsFromCart,
} from "@/lib/actions/cart/cart-actions";
import { calcPrice } from "@/lib/actions/cart/cart-utils";

describe("cart actions", () => {
  it("exposes the remove-one cart action expected by the client", () => {
    expect(typeof removeItemsFromCart).toBe("function");
    expect(removeItemsFromCart).toBe(removeItemFromCart);
  });

  it("returns cart totals as a plain object for cart validation", () => {
    expect(
      calcPrice([
        {
          productId: "product-1",
          name: "Product",
          slug: "product",
          qty: 2,
          image: "/product.jpg",
          price: "1000",
        },
      ]),
    ).toEqual({
      itemsPrice: "2000",
      shippingPrice: "500",
      taxPrice: "200",
      totalPrice: "2700",
    });
  });
});
