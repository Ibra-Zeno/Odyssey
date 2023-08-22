import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

const isProd = process.env.NODE_ENV === "production";

// Prevent multiple instances of Prisma Client in development
const createPrismaInstance = () => new PrismaClient();

const getPrismaInstance = () => {
  if (isProd) {
    return createPrismaInstance();
  } else {
    if (!global.prisma) {
      global.prisma = createPrismaInstance();
    }
    return global.prisma;
  }
};

const prisma = getPrismaInstance();

export default prisma;
