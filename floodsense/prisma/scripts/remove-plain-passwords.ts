/**
 * Removes users whose password is stored in plain text (not bcrypt hashed).
 * Run once after enabling bcrypt: npx tsx prisma/scripts/remove-plain-passwords.ts
 */
import "dotenv/config";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

dotenv.config({ path: ".env.local", override: true });

const BCRYPT_HASH_PREFIX = /^\$2[aby]\$/;

function isBcryptHash(value: string): boolean {
  return BCRYPT_HASH_PREFIX.test(value);
}

async function main() {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  });
  const prisma = new PrismaClient({ adapter });

  const users = await prisma.user.findMany({ select: { id: true, email: true, password: true } });
  const plainPasswordUsers = users.filter((u) => !isBcryptHash(u.password));

  if (plainPasswordUsers.length === 0) {
    console.log("✅ No users with plain-text passwords found.");
    await prisma.$disconnect();
    return;
  }

  console.log(`Found ${plainPasswordUsers.length} user(s) with plain-text passwords:`);
  for (const u of plainPasswordUsers) {
    console.log(`  - ${u.email} (${u.id})`);
  }

  const ids = plainPasswordUsers.map((u) => u.id);
  const result = await prisma.user.deleteMany({ where: { id: { in: ids } } });
  console.log(`\n✅ Removed ${result.count} user(s). They can sign up again with secure passwords.`);

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
