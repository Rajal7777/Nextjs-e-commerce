'use client';


import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { toast } from "sonner";
import addItemToCart from '@/lib/actions/cart-action';
import { cartItem } from '@/types';

const AddToCart = ({ item }: { item: cartItem; }) => {
    const router = useRouter();

    const handleAddToCart = async () => {
        const res = await addItemToCart(item);

        if (res.success) {
            toast.success(`${item.name} ${res.message}`);
            router.refresh();
        } else {
            toast.error(res.message);
        }
        return res;
    };

    return (
        <Button className="w-full" type='button' variant="default"
            onClick={handleAddToCart}>
            Add to cart
        </Button>
    );
};


export default AddToCart;