import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            clerkId: true,
            username: true,
            email: true
        }
    })

    console.log("Total users:", users.length)
    console.table(users)

    const usernames = users.map(u => u.username).filter(Boolean)
    const duplicates = usernames.filter((item, index) => usernames.indexOf(item) !== index)

    if (duplicates.length > 0) {
        console.log("\n Duplicate usernames found (should be impossible due to unique constraint):", duplicates)
    } else {
        console.log("\n No duplicate usernames found in DB (as expected)")
    }

    // Check if "clerk1" exists
    const devUser = users.find(u => u.clerkId === "clerk1")
    if (devUser) {
        console.log("\n⚠️ Dev user 'clerk1' exists with username:", devUser.username)
    }
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
