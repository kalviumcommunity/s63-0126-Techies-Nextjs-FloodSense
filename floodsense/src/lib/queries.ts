import { prisma } from "./prisma";

export async function getRecentAlerts() {
  return prisma.alert.findMany({
    select: {
      id: true,
      message: true,
      severity: true,
      createdAt: true,
    },
    take: 10,
    orderBy: {
      createdAt: "desc",
    },
  });
}
