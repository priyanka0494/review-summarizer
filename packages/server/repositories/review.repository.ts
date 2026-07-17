import type { Review } from "../generated/prisma/client";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set");
}

const adapter = new PrismaMariaDb(databaseUrl);
const prisma = new PrismaClient({ adapter });

export const reviewRepository = {
  // SELECT * FROM reviews WHERE productId = @productId ORDER BY createdAt DESC
  async getReviews(productId: number): Promise<Review[]> {
    return await prisma.review.findMany({
      where: { productId },
      orderBy: { createdAt: "desc" },
    });
  },
};
