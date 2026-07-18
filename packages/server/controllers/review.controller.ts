import type { Request, Response } from "express";
import { reviewService } from "../services/review.service";
import { productRepository } from "../repositories/product.repository";
import { reviewRepository } from "../repositories/review.repository";

export const reviewController = {
  async getReviews(req: Request, res: Response) {
    const productId = Number(req.params.id);

    if (isNaN(productId)) {
      res.status(400).json({ error: "Invalid product ID" });
      return;
    }

    const reviews = await reviewService.getReviews(productId);

    res.json(reviews);
  },

  async summarizeReviews(req: Request, res: Response) {
    const productId = Number(req.params.id);

    if (isNaN(productId)) {
      res.status(400).json({ error: "Invalid product ID" });
      return;
    }

    productRepository.getProduct(productId).then((product) => {
      if (!product) {
        res.status(404).json({ error: "Product not found" });
        return;
      }
    });

    const review = await reviewRepository.getReviews(productId, 1);
    if (!review.length) {
      res.status(404).json({ error: "No reviews to summarize" });
      return;
    }

    const summary = await reviewService.summarizeReviews(productId);

    res.json({ summary });
  },
};
