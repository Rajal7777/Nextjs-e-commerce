import { hashSync } from "bcryptjs";

const sampleData = {
  users: [
    {
      name: "admin",
      email: "admin@test.com",
      password: hashSync("123456", 10),
      role: "admin",
    },
    {
      name: "user",
      email: "user@test.com",
      password: hashSync("123456", 10),
      role: "user",
    },
  ],
  products: [
    {
      name: "UNIQLO Premium Cotton Hoodie",
      slug: "uniqlo-premium-cotton-hoodie",
      category: "Men's Sweatshirts",
      description:
        "Soft cotton-blend hoodie designed for everyday comfort and casual wear in Japan.",
      images: [
        "/images/sample-products/3b.png",
        "/images/sample-products/3bl.png",
      ],
      price: 3990,
      brand: "UNIQLO",
      rating: 4.5,
      numReviews: 10,
      stock: 5,
      isFeatured: false,
      banner: null,
    },

    {
      name: "GU Heavyweight Flannel Hoodie",
      slug: "gu-heavyweight-flannel-hoodie",
      category: "Men's Sweatshirts",
      description:
        "Warm and comfortable flannel hoodie with a relaxed fit, perfect for casual autumn and winter outfits.",
      images: [
        "/images/sample-products/2g.png",
        "/images/sample-products/2gr.png",
      ],
      price: 4990,
      brand: "GU",
      rating: 4.2,
      numReviews: 8,
      stock: 10,
      isFeatured: true,
      banner: "/images/banner/banner-2.jpg",
    },

    {
      name: "MUJI Organic Cotton Oxford Shirt",
      slug: "muji-organic-cotton-oxford-shirt",
      category: "Men's Dress Shirts",
      description:
        "Clean and versatile Oxford shirt made with comfortable cotton fabric for everyday and smart-casual wear.",
      images: [
        "/images/sample-products/8b.png",
        "/images/sample-products/8gr.png",
      ],
      price: 4990,
      brand: "MUJI",
      rating: 4.9,
      numReviews: 3,
      stock: 0,
      isFeatured: true,
      banner: "/images/banner/banner-3.jpg",
    },

    {
      name: "UNIQLO Stretch Selvedge Denim Shirt",
      slug: "uniqlo-stretch-selvedge-denim-shirt",
      category: "Men's Dress Shirts",
      description:
        "Modern denim shirt with a comfortable stretch finish, suitable for casual everyday styling.",
      images: ["/images/sample-products/p3-1.jpg"],
      price: 3500,
      brand: "UNIQLO",
      rating: 3.6,
      numReviews: 5,
      stock: 10,
      isFeatured: true,
      banner: "/images/banner/banner-1.jpg",
    },

    {
      name: "NIKE GEL-Contend Running Shoes",
      slug: "nike-gel-contend-running-shoes",
      category: "Men's Shoes",
      description:
        "Comfortable running shoes with responsive cushioning for daily walking, jogging, and everyday activities.",
      images: [
        "/images/sample-products/6g.png",
        "/images/sample-products/6w.png",
      ],
      price: 7980,
      brand: "NIKE",
      rating: 4.7,
      numReviews: 18,
      stock: 6,
      isFeatured: false,
      banner: null,
    },

    {
      name: "Nike 574 Classic Sneakers",
      slug: "nike-574-classic-sneakers",
      category: "Running Shoes",
      description:
        "Iconic everyday sneakers combining classic styling with lightweight cushioning and all-day comfort.",
      images: ["/images/sample-products/7g.png"],
      price: 11990,
      brand: "Nike",
      rating: 4.7,
      numReviews: 18,
      stock: 6,
      isFeatured: false,
      banner: null,
    },

    {
      name: "MUJI Easy-Care Button-Down Shirt",
      slug: "muji-easy-care-button-down-shirt",
      category: "Men's Dress Shirts",
      description:
        "Simple button-down shirt with a clean silhouette and comfortable fabric for everyday office and casual wear.",
      images: [
        "/images/sample-products/4p.png",
        "/images/sample-products/4w.png",
      ],
      price: 4490,
      brand: "MUJI",
      rating: 4.4,
      numReviews: 7,
      stock: 14,
      isFeatured: false,
      banner: null,
    },

    {
      name: "UNIQLO Denim Overshirt",
      slug: "uniqlo-denim-overshirt",
      category: "Men's Dress Shirts",
      description:
        "Versatile denim overshirt with a relaxed fit, perfect for layering during Japan's cooler seasons.",
      images: [
        "/images/sample-products/8b.png",
        "/images/sample-products/8gr.png",
      ],
      price: 4990,
      brand: "UNIQLO",
      rating: 4.1,
      numReviews: 9,
      stock: 11,
      isFeatured: false,
      banner: null,
    },

    {
      name: "UNIQLO Dry-Ex Polo Shirt",
      slug: "uniqlo-dry-ex-polo-shirt",
      category: "Men's Dress Shirts",
      description:
        "Lightweight polo shirt with quick-drying fabric, ideal for active days and warm Japanese summers.",
      images: [
        "/images/sample-products/p1-1.jpg",
        "/images/sample-products/p1-2.jpg",
      ],
      price: 2990,
      brand: "UNIQLO",
      rating: 4.5,
      numReviews: 10,
      stock: 5,
      isFeatured: false,
      banner: null,
    },

    {
      name: "GU Relaxed Fit Long Sleeve Shirt",
      slug: "gu-relaxed-fit-long-sleeve-shirt",
      category: "long-sleeve-shirt",
      description:
        "Relaxed long-sleeve shirt with a simple modern design for comfortable everyday styling.",
      images: ["/images/sample-products/p2-1.jpg"],
      price: 2990,
      brand: "GU",
      rating: 4.2,
      numReviews: 8,
      stock: 10,
      isFeatured: false,
      banner: null,
    },

    {
      name: "UNIQLO Easy Care Dress Shirt",
      slug: "uniqlo-easy-care-dress-shirt",
      category: "easy-care-dress-shirt",
      description:
        "Easy-care dress shirt with a clean fit, designed for comfortable office and business-casual wear.",
      images: ["/images/sample-products/p3-1.jpg"],
      price: 3990,
      brand: "UNIQLO",
      rating: 4.9,
      numReviews: 3,
      stock: 0,
      isFeatured: false,
      banner: null,
    },

    {
      name: "BEAMS Slim Oxford Shirt",
      slug: "beams-slim-oxford-shirt",
      category: "Slim-oxford-shirt",
      description:
        "Refined Oxford shirt with a modern slim silhouette, suitable for both casual and smart-casual outfits.",
      images: [
        "/images/sample-products/p4-1.jpg",
     ],
      price: 8800,
      brand: "BEAMS",
      rating: 3.6,
      numReviews: 5,
      stock: 10,
      isFeatured: false,
      banner: null,
    },

{
  name: "Nike Air Max Classic Sneakers",
  slug: "nike-air-max-classic-sneakers",
  category: "Shoes",
  description:
    "Iconic low-profile sneakers inspired by classic street style with a comfortable everyday fit and visible cushioning.",
  images: [
    "/images/sample-products/6w.png",
  ],
  price: 15500,
  brand: "Nike",
  rating: 4.7,
  numReviews: 18,
  stock: 6,
  isFeatured: false,
  banner: null,
},

    {
      name: "GU Soft Touch Pullover Hoodie",
      slug: "gu-soft-touch-pullover-hoodie",
      category: "Men's Sweatshirts",
      description:
        "Soft-touch pullover hoodie with a relaxed fit, perfect for casual weekends and everyday wear.",
      images: [
        "/images/sample-products/p6-1.jpg",
        "/images/sample-products/p6-2.jpg",
      ],
      price: 3490,
      brand: "GU",
      rating: 4.6,
      numReviews: 12,
      stock: 8,
      isFeatured: false,
      banner: null,
    },
  ],
};

export default sampleData;
