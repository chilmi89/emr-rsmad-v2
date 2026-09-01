import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  try {
    return new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });
  } catch (err) {
    console.warn("PrismaClient failed to initialize. Run 'npx prisma generate' to fix.");
    return new Proxy({} as PrismaClient, {
      get: () => () => {
        throw new Error("@prisma/client belum di-generate. Silakan jalankan 'npx prisma generate' di terminal Anda.");
      },
    });
  }
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
