const { PrismaClient } = require("@prisma/client");

const database = new PrismaClient();

async function main() {
    try {
        await database.category.createMany({
            data: [
                { name: "Computer Science" },
                { name: "Music" },
                { name: "Accounting" },
                { name: "Photography" },
                { name: "Fitness" },
                { name: "Filming" },
                { name: "Engineering" },
            ],
            skipDuplicates: true 
        });
        console.log("Success");
    } catch (error) {
        console.log("Error seeding the database categories", error);
    } finally {
        await database.$disconnect();
    }
}

main();
