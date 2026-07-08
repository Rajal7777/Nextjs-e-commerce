import { getOrderById } from "@/lib/actions/order-actions";
import { ShippingAddress } from "@/types";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import OrderDetailsTable from "./order-detail-table";

export const metadata: Metadata ={
    title: 'Order Details'
}

const OrderDetailsPage = async ({params}: {params: Promise<{id: string}>}) => {
    const { id } = await params;

    const order = await getOrderById(id);
    if (!order) notFound();

    return ( 
    <OrderDetailsTable order={{
        ...order,
        shippingAddress: order.shippingAddress as ShippingAddress,
    }} />
     );
}
 
export default OrderDetailsPage;