import { prisma } from "./prisma";

export async function createAlertWithDistrict(
  districtId: string,
  createdBy: string,
  title: string,
  message: string,
  severity: "LOW" | "MODERATE" | "HIGH" | "SEVERE" = "HIGH"
) {
  try {
    const result = await prisma.$transaction([
      prisma.alert.create({
        data: {
          title,
          message,
          severity,
          districtId,
          createdBy,
        },
      }),
    ]);
    return result;
  } catch (error) {
    console.error("Transaction failed, rolled back", error);
    throw error;
  }
}
