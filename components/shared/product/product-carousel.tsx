"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { ClientProduct } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const FALLBACK_IMAGE = "/placeholder-banner.png";

const ProductCarousel = ({ products }: { products: ClientProduct[] }) => {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (productId: string) => {
    setImageErrors((prev) => ({ ...prev, [productId]: true }));
  };

  return (
    <div className="flex my-2 md:my-4 lg:my-6">
      <Carousel
        className="w-full max-w-7xl mx-auto overflow-hidden border"
        opts={{ loop: true }}
        plugins={[
          Autoplay({
            delay: 5000,
            stopOnInteraction: true,
            stopOnMouseEnter: true,
          }),
        ]}
      >
    <CarouselContent>
      {products.map((product) => {
        // Safely evaluate image source
        const hasError = imageErrors[product.id];
        const imageSrc =
          !hasError && product.banner && product.banner.trim() !== ""
            ? product.banner
            : FALLBACK_IMAGE;

        return (
          <CarouselItem key={product.id} className="pl-0">
            <Link
              href={`/product/${product.slug}`}
              className="group relative block aspect-video md:aspect-21/9 w-full overflow-hidden bg-gray-100"
            >
              <Image
                src={imageSrc}
                alt={product.name || product.description || "Product Banner"}
                fill
                priority
                sizes="100vw"
                onError={() => handleImageError(product.id)}
                className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
              />

              {/* Gradient Overlay & Text Container */}
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent flex items-end justify-start p-6 md:p-10">
                <div className="max-w-xl text-white">
                  <h3 className="text-lg md:text-2xl font-bold tracking-tight drop-shadow">
                    {product.name}
                  </h3>
                  {product.description && (
                    <p className="mt-1 text-xs md:text-sm text-gray-200 line-clamp-2 drop-shadow">
                      {product.description}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          </CarouselItem>
        );
      })}
    </CarouselContent>

        <CarouselPrevious className="left-2 md:left-4" />
        <CarouselNext className="right-2 md:right-4" />
      </Carousel>
    </div>
  );
};

export default ProductCarousel;
