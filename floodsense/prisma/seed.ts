import "dotenv/config";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

dotenv.config({ path: ".env.local", override: true });

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  const district = await prisma.district.upsert({
    where: { name: "Shamli" },
    update: {},
    create: {
      name: "Shamli",
      state: "Uttar Pradesh",
      country: "IN",
    },
  });

  const hashedPassword = await bcrypt.hash("TestPassword123", 10);
  const user = await prisma.user.upsert({
    where: { email: "test@floodsense.com" },
    update: { password: hashedPassword },
    create: {
      name: "Test User",
      email: "test@floodsense.com",
      password: hashedPassword,
    },
  });

  await prisma.alert.create({
    data: {
      title: "Test Flood Alert",
      message: "Sample alert for seeding",
      severity: "HIGH",
      districtId: district.id,
      createdBy: user.id,
    },
  });

  console.log("✅ Seed complete");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
