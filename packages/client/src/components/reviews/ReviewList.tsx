import { useEffect, useState } from "react";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import StarRating from "./StarRating";
import { useQuery } from "@tanstack/react-query";

type Props = {
  productId: number;
};

type Review = {
  id: number;
  author: string;
  content: string;
  rating: number;
  createdAt: string;
};

type GetReviewsResponse = {
  summary: string | null;
  reviews: Review[];
};

const ReviewList = ({ productId }: Props) => {
  const {
    data: reviewData,
    isLoading,
    error,
  } = useQuery<GetReviewsResponse>({
    queryKey: ["reviews", productId],
    queryFn: async () => {
      const { data } = await axios.get<GetReviewsResponse>(
        `/api/products/${productId}/reviews`,
      );
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-5">
        {[1, 2, 3].map((i) => (
          <div key={i}>
            <Skeleton width={150} />
            <Skeleton width={100} />
            <Skeleton count={2} />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500">
        {"Could not fetch reviews. Try again!"}
      </div>
    );
  }

  return (
    <div className={"flex flex-col gap-5"}>
      {reviewData?.reviews.map((review) => (
        <div key={review.id}>
          <div className={"font-bold"}>{review.author}</div>
          <div>
            <StarRating value={review.rating} />
          </div>
          <div className={"py-2"}>{review.content}</div>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
