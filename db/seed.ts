import "dotenv/config";

import { prisma } from "../lib/prisma";
import sampleData from "./sample-data";

console.log("DATABASE_URL:seed.ts", process.env.DATABASE_URL);
async function main() {
    await prisma.product.deleteMany();
    await prisma.account.deleteMany();
    await prisma.session.deleteMany();
    await prisma.verificationRequest.deleteMany();
    await prisma.user.deleteMany();

    await prisma.product.createMany({ data: sampleData.products });
    await prisma.user.createMany({data: sampleData.users})

    console.log('Database seeded successfully!');
}

main();


