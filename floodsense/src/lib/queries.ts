import { prisma } from "./prisma";

export async function getRecentAlerts() {
  return prisma.alert.findMany({
    select: {
      id: true,
      title: true,
      message: true,
      severity: true,
      status: true,
      issuedAt: true,
    },
    take: 10,
    orderBy: { issuedAt: "desc" },
  });
}
