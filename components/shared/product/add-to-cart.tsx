'use client';


import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { toast } from "sonner";
import addItemToCart from '@/lib/actions/cart-action';
import { CartItem } from '@/types';
import { Plus } from 'lucide-react';

const AddToCart = ({ item }: { item: CartItem; }) => {
    const router = useRouter();

    const handleAddToCart = async () => {
        const res = await addItemToCart(item);

        if (res.success) {
            toast.success(res.message);
            router.refresh();
        } else {
            toast.error(res.message);
        }

        return res;
    };

    return (
        <Button className="w-full" type='button' variant="default"
            onClick={handleAddToCart}>
            <Plus /> Add to cart
        </Button>
    );
};


export default AddToCart;