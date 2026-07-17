import { reviewRepository } from "../repositories/review.repository";
import type { Review } from "../generated/prisma/client";

export const reviewService = {
  async getReviews(productId: number): Promise<Review[]> {
    return await reviewRepository.getReviews(productId);
  },
};
