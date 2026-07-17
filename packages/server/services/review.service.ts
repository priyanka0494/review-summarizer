import { reviewRepository } from "../repositories/review.repository";
import type { Review } from "../generated/prisma/client";

export const reviewService = {
  async getReviews(productId: number): Promise<Review[]> {
    return await reviewRepository.getReviews(productId);
  },

  async summarizeReviews(productId: number): Promise<string> {
    //Get last 10 reviews
    const reviews = await reviewRepository.getReviews(productId, 10);
    const jointReviews = reviews.map((r) => r.content).join("\n\n");

    //Send reviews to LLM

    const summary = "This is the placeholder for summary";
    return summary;
  },
};
