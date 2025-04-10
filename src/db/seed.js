const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
    console.log("Clearing database...");
    
    await prisma.order.deleteMany({});
    await prisma.cartItem.deleteMany({});
    await prisma.cart.deleteMany({});
    await prisma.session.deleteMany({});
    await prisma.account.deleteMany({});
    await prisma.user.deleteMany({});
    
    console.log("Database cleared. Now seeding...");

    const user1 = await prisma.user.create({
        data: {
            admissionNo: "A12345",
            name: "Dummy1",
            email: "dummy1@example.com",
            year: 1,
            washes: 40,
            isSubscribed: false,
        }
    });

    const user2 = await prisma.user.create({
        data: {
            admissionNo: "A67890",
            name: "Dummy2",
            email: "dummy2@example.com",
            year: 2,
            washes: 30,
            isSubscribed: true,
        }
    });

    const cart1 = await prisma.cart.create({
        data: {
            userId: user1.id,
            items: {
                create: [
                    { item: "Jeans", weight: 1.2, quantity: 2 },
                    { item: "Shirt", weight: 0.5, quantity: 3 }
                ]
            }
        }
    });

    const cart2 = await prisma.cart.create({
        data: {
            userId: user2.id,
            items: {
                create: [
                    { item: "Towel", weight: 0.8, quantity: 4 }
                ]
            }
        }
    });

    await prisma.order.create({
        data: {
            userId: user1.id,
            cartId: cart1.id,
            orderStatus: "OrderPlaced",
            laundryName: "Krishna_Tower_Basement"
        }
    });

    await prisma.order.create({
        data: {
            userId: user2.id,
            cartId: cart2.id,
            orderStatus: "OrderNotInitiated",
            laundryName: "Vedhavathi_Tower_Basement"
        }
    });

    console.log("Database seeded successfully.");
}

main()
    .catch((error) => {
        console.error("Error seeding database:", error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
});