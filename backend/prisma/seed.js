var { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()


async function main() {
    const alice = await prisma.user.upsert({
        where: { email: "test1", userId: "ee36ee47-086f-45a0-b32d-d25a27788423" },
        update: {},
        create: {
            email: 'test1',
            name: 'Alice',
            role: "coach",
        },
    });
    const bob = await prisma.user.upsert({
        where: { email: 'test2', userId: "82d68613-ceab-4541-9a21-b6cc78984692" },
        update: {},
        create: {
            email: 'test2',
            name: 'Bob',
            role: "client",
            coach: { connect: { userId: alice.userId } },
        },
    });

    console.log({ alice, bob })
}


main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })