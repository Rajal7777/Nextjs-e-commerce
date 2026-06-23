'use server';
//prisma object lets you communicate with database
import { prisma } from '@/lib/prisma';
import { convertToPlainObject } from '../constants/utils';

//Get latest products
export async function getLatestProducts() {
    const data = await prisma.product.findMany({
        take: 6,
        orderBy: { createdAt: 'desc' }
    });

    return convertToPlainObject(data);
}