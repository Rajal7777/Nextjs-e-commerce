import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

const ProductCart = ({product}: {product: any}) => {
    return ( 
        <Card className="w-full max-w-sm gap-2">
            <CardHeader>
                <Link href={`/product/${product.slug}`}>
                <Image src={product.images[0]} 
                alt={product.name}
                height={300}
                width={300}
                />
                </Link>
            </CardHeader>

            <CardContent className="p-4 grid gap-4">
                <div className="text-xs">{product.brand}</div>

                <Link href={`product/${product.slug}`}>
                {product.name}
                </Link>

                <div className="flex-between gap-4">
                    <p>{product.rating} Stars</p>
                    {product.stock > 0 ?(
                        <p className="font-bold">{product.price}</p>
                    ):(
                        <p className="text-destructive">Out of stuck</p>
                    )}
                </div>
            </CardContent>
        </Card>
     );
}
 
export default ProductCart;