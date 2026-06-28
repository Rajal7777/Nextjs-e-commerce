export type Product = {
    id: string;
    name: string;
    slug: string;
    category: string;
    images: string[];
    brand: string;
    description: string;
    stock: number;
    price: unknown;
    rating: unknown;
    numReviews: number;
    isFeatured: boolean;
    banner: string | null;
    createdAt: Date;
};
