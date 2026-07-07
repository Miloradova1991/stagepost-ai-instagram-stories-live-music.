import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __stagepostPrisma: PrismaClient | undefined;
}

export const prisma =
  global.__stagepostPrisma ??
  new PrismaClient({
    log: ["error"]
  });

if (process.env.NODE_ENV !== "production") {
  global.__stagepostPrisma = prisma;
}
