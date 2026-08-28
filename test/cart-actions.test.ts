import {
  removeItemFromCart,
  removeItemsFromCart,
} from "@/lib/actions/cart/cart-actions";

describe("cart actions", () => {
  it("exposes the remove-one cart action expected by the client", () => {
    expect(typeof removeItemsFromCart).toBe("function");
    expect(removeItemsFromCart).toBe(removeItemFromCart);
  });
});
