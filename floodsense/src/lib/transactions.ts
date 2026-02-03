import { prisma } from "./prisma";

export async function createAlertWithDistrict(districtId: number, message: string) {
  try {
    const result = await prisma.$transaction([
      prisma.alert.create({
        data: {
          message,
          severity: "high",
          districtId,
        },
      }),
    ]);

    return result;
  } catch (error) {
    console.error("Transaction failed, rolled back", error);
    throw error;
  }
}
