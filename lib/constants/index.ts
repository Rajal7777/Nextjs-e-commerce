export const APP_NAME = process.env.NEXT_APP_NAME || "New-store";
export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

export const LATEST_PRODUCTS_LIMIT =
  Number(process.env.LATEST_PRODUCTS_LIMIT) || 4;

export const signInDefaultValues = {
  email: "",
  password: "",
};

export const signUpDefaultValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export const shippingAdressDefaultValue = {
  fullName: "Rajal Suwal",
  streetAddress: "",
  city: "",
  postalCode: "",
  country: "",
};

export const PAYMENT_METHODS =
  process.env.NEXT_PUBLIC_PAYMENT_METHODS?.split(",") ?? [];

export const DEFAULT_PAYMENT_METHOD =
  process.env.NEXT_PUBLIC_DEFAULT_PAYMENT_METHOD ?? "CashOnDelivery";

export const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 10;

export const productDefaultValues = {
  id: "",
  name: "",
  slug: "",
  category: "",
  brand: "",
  description: "",
  images: [],
  isFeatured: false,
  banner: "",
  price: "0",
  stock: 0,
  rating: 0,
  numReviews: 0,
};

export const userDefaultValues = ["admin", "user"];
