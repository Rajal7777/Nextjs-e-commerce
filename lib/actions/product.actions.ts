'use server';
//prisma object lets you communicate with database
import { prisma } from '@/lib/prisma';
import { convertToPlainObject } from '../utils';


//Get latest products
export async function getLatestProducts() {
    const data = await prisma.product.findMany({
        take: 4,
        orderBy: { createdAt: 'desc' }
    });

    return convertToPlainObject(data);
}