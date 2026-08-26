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

const ProductCarousel = ({ products }: { products: ClientProduct[] }) => {
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
          {products.map((product) => (
            <CarouselItem key={product.id}>
              <Link
                href={`/product/${product.slug}`}
                className="relative block h-100 overflow-hidden"
              >
                <Image
                  src={product.banner!}
                  alt={product.description}
                  fill
                  sizes="100vw"
                  className="object-contain"
                />

                <div className="absolute inset-0 flex items-end justify-center">
                  <p className="bg-gray-800/80 text-white font-medium px-2 py-1">
                    {product.name}
                  </p>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="left-2 md:left-4" />
        <CarouselNext className="right-2 md:right-4" />
      </Carousel>
    </div>
  );
};

export default ProductCarousel;
