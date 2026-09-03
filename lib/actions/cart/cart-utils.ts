import { CartItem } from "@/types";
import { calculateConsumptionTax, roundDecimal } from "../../utils";

//Calculate price
export const calcPrice = (items: CartItem[]) => {
  const itemsPrice = roundDecimal(
    items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0),
  );

  const shippingPrice = roundDecimal(itemsPrice >= 10000 ? 0 : 500);
  const taxPrice = calculateConsumptionTax(itemsPrice);
  const totalPrice = roundDecimal(itemsPrice + taxPrice + shippingPrice);

  return {
    itemsPrice: String(itemsPrice),
    shippingPrice: String(shippingPrice),
    taxPrice: String(taxPrice),
    totalPrice: String(totalPrice),
  };
};
