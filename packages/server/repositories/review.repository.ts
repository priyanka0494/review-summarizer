import dayjs from "dayjs";
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
  async getReviews(productId: number, limit?: number): Promise<Review[]> {
    return await prisma.review.findMany({
      where: { productId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  },

  async storeReviewSummary(productId: number, summary: string) {
    const now = new Date();
    const expiresAt = dayjs().add(7, "day").toDate();
    const data = {
      productId,
      content: summary,
      expiresAt: expiresAt,
      createdAt: now,
    };

    await prisma.summary.upsert({
      where: { productId },
      create: data,
      update: data,
    });
  },

  getReviewSummary(productId: number) {
    return prisma.summary.findUnique({
      where: { productId },
    });
  },
};
