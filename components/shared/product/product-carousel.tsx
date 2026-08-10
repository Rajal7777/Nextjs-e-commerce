'use client';

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { ClientProduct } from '@/types';
import Link from 'next/link';
import Image from 'next/image';

const ProductCarousel = ({ products }: {
    products: ClientProduct[];
}) => {
    return (
        <div className="flex my-2 md:my-4 lg:my-6">
            <Carousel className="w-full max-w-7xl mx-auto overflow-hidden border"
                opts={{ loop: true, }}
                plugins={[
                    Autoplay({
                        delay: 8000,
                        stopOnInteraction: true,
                        stopOnMouseEnter: true,
                    }),
                ]}
            >

                <CarouselContent>
                    {products.map((product) => (
                        <CarouselItem key={product.id}>
                            <Link href={`/product/${product.slug}`}>
                                <div className="relative w-full h-[20vh] sm:h-[25vh] md:h-[30vh] lg:h-[60vh]">
                                    <Image
                                        src={product.banner!}
                                        alt={product.description}
                                        width={0}
                                        height={0}
                                        sizes="100vw"
                                        className="w-full h-full object-cover"
                                    />

                                    <div className="absolute inset-0 flex items-end justify-center">
                                        <p className="bg-gray-800/80 text-white font-medium px-2 py-1">
                                            {product.name}
                                        </p>
                                    </div>
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