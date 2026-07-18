import { reviewRepository } from "../repositories/review.repository";
import type { Review } from "../generated/prisma/client";
import { llmClient } from "../llm/client";
import template from "../prompts/summary.txt";

export const reviewService = {
  async getReviews(productId: number): Promise<Review[]> {
    return await reviewRepository.getReviews(productId);
  },

  async summarizeReviews(productId: number): Promise<string> {
    //check if summary already exists in database
    const existingSummary = await reviewRepository.getReviewSummary(productId);
    if (existingSummary && existingSummary.expiresAt > new Date()) {
      return existingSummary.content;
    }

    //Get last 10 reviews
    const reviews = await reviewRepository.getReviews(productId, 10);
    const jointReviews = reviews.map((r) => r.content).join("\n\n");

    //Send reviews to LLM
    const prompt = template.replace("{{reviews}}", jointReviews);

    const { text: summary } = await llmClient.generateText({
      model: "gpt-4o-mini",
      prompt,
      temperature: 0.2,
      maxTokens: 500,
    });

    reviewRepository.storeReviewSummary(productId, summary); //store summary in database

    return summary;
  },
};
