const { PrismaClient, RiskLevel } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  const district = await prisma.district.upsert({
    where: {
      name_state: { name: "Shamli", state: "Uttar Pradesh" },
    },
    update: {},
    create: {
      name: "Shamli",
      state: "Uttar Pradesh",
      latitude: 29.45,
      longitude: 77.32,
    },
  });

  const user = await prisma.user.upsert({
    where: { email: "test@floodsense.com" },
    update: {},
    create: {
      name: "Test User",
      email: "test@floodsense.com",
      password: "hashed-password",
    },
  });

  await prisma.alertPreference.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      rainfallThreshold: 50,
      riskThreshold: RiskLevel.HIGH,
    },
  });

  await prisma.weatherData.create({
    data: {
      districtId: district.id,
      rainfallMm: 65,
      temperature: 30,
      humidity: 80,
      riskLevel: RiskLevel.HIGH,
    },
  });

  console.log("✅ Seed complete");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
