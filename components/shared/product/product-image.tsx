'use client';

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

const ProductImages = ({ images }: { images: string[]; }) => {
    const [current, setCurrent] = useState(0);


    return (
        <div className="space-y-4">
            <Image
                src={images[current]}
                alt="Product image"
                width={1000}
                height={1000}
                preload={true}
                loading="eager"
                className="min-h-75 object-cover object-center"
            />

            <div className="flex justify-center mb-6">
                {images.map((image, index) => (
                    <div key={index} onClick={() => setCurrent(index)}
                        className={cn('border mr-2 cursor-pointer hover:border-gray-400',
                            current === index && 'border-gray-600')
                        }
                    >
                        <Image src={image} alt="image with multi choise" width={100} height={100} preload={true}
                            loading="eager" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductImages;