"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

const ProductImages = ({ images }: { images: string[] }) => {
  const [current, setCurrent] = useState(0);

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-3 md:grid-cols-[72px_1fr] max-w-4xl mx-auto">
      <div className="order-2 flex gap-2 overflow-x-auto md:order-1 md:flex-col md:overflow-visible">
        {images.map((image, index) => (
          <button
            key={image + index}
            type="button"
            onClick={() => setCurrent(index)}
            className={cn(
              "relative h-16 w-16 shrink-0 overflow-hidden rounded-md border",
              "transition-colors hover:border-primary",
              current === index
                ? "border-primary ring-1 ring-primary"
                : "border-border",
            )}
            aria-label={`Show image ${index + 1}`}
          >
            <Image
              src={image}
              alt={`Product thumbnail ${index + 1}`}
              fill
              sizes="80px"
              className="object-cover"
              preload={true}
              loading="eager"
            />
          </button>
        ))}
      </div>

      <div className="order-1 p-1.5 md:order-2 border-l border-l-primary/60">
        <div className="relative mx-auto aspect-3/4 w-full max-w-60 overflow-hidden rounded-lg md:max-w-85 ">
          <Image
            src={images[current]}
            alt="Product image"
            fill
            sizes="(max-width: 768px) 100vw, 60vw"
            preload={true}
            loading="eager"
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default ProductImages;
