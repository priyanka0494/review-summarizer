import Openai from "openai";
import { reviewRepository } from "../repositories/review.repository";
import type { Review } from "../generated/prisma/client";

const client = new Openai({
  apiKey: process.env.OPENAI_API_KEY,
});

export const reviewService = {
  async getReviews(productId: number): Promise<Review[]> {
    return await reviewRepository.getReviews(productId);
  },

  async summarizeReviews(productId: number): Promise<string> {
    //Get last 10 reviews
    const reviews = await reviewRepository.getReviews(productId, 10);
    const jointReviews = reviews.map((r) => r.content).join("\n\n");

    //Send reviews to LLM
    const prompt = `Summarize the following customer reviews into short paragraph highlighting key themes, both positive and negative:

    ${jointReviews}`;

    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input: prompt,
      temperature: 0.2,
      max_output_tokens: 500,
    });

    return response.output_text || "No summary available.";
  },
};
