import { PrismaClient, RiskLevel } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const district = await prisma.district.create({
    data: {
      name: "Shamli",
      state: "Uttar Pradesh",
      latitude: 29.45,
      longitude: 77.32,
    },
  });

  const user = await prisma.user.create({
    data: {
      name: "Test User",
      email: "test@floodsense.com",
      password: "hashed-password",
    },
  });

  await prisma.alertPreference.create({
    data: {
      userId: user.id,
      rainfallThreshold: 50,
      riskThreshold: RiskLevel.HIGH,
    },
  });

  await prisma.weatherData.create({
    data: {
      districtId: district.id,
      rainfallMm: 62,
      temperature: 31,
      humidity: 78,
      riskLevel: RiskLevel.HIGH,
    },
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
