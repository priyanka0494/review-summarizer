import express from "express";
import { PrismaClient } from "./generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

import type { Request, Response } from "express";

const router = express.Router();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set");
}

const adapter = new PrismaMariaDb(databaseUrl);
const prisma = new PrismaClient({ adapter });

// Get
router.get("/api/products/:id/reviews", async (req: Request, res: Response) => {
  const productId = Number(req.params.id);

  if (isNaN(productId)) {
    res.status(400).json({ error: "Invalid product ID" });
    return;
  }

  // SELECT * FROM reviews WHERE productId = @productId ORDER BY createdAt DESC
  const reviews = await prisma.review.findMany({
    where: { productId },
    orderBy: { createdAt: "desc" },
  });

  res.json(reviews);
});

export default router;
