import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import ReviewSkeleton from "./ReviewSkeleton";
import StarRating from "./StarRating";
import { HiSparkles } from "react-icons/hi2";
import { Button } from "../ui/button";
import { useState } from "react";

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

type SummarizeResponse = {
  summary: string;
};

const ReviewList = ({ productId }: Props) => {
  const [summary, setSummary] = useState("");
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState("");

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

  const handleSummarize = async () => {
    try {
      setIsSummaryLoading(true);
      setSummaryError("");
      const { data } = await axios.post<SummarizeResponse>(
        `/api/products/${productId}/reviews/summarize`,
      );
      setSummary(data.summary);
    } catch (error) {
      console.log(error);
      setSummaryError("Could not summarize reviews. Try again!");
    } finally {
      setIsSummaryLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-5">
        {[1, 2, 3, 4, 5].map((i) => (
          <ReviewSkeleton key={i} />
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

  if (!reviewData?.reviews?.length) {
    return null;
  }

  const currentSummary = summary || reviewData?.summary;

  return (
    <div>
      <div className={"mb-5"}>
        {currentSummary ? (
          <p>{currentSummary}</p>
        ) : (
          <>
            <Button
              onClick={handleSummarize}
              className={"cursor-pointer"}
              disabled={isSummaryLoading}
            >
              <HiSparkles />
              Summarize
            </Button>
            {isSummaryLoading && (
              <div className={"py-5"}>
                <ReviewSkeleton />
              </div>
            )}
            {summaryError && <p className="text-red-500">{summaryError}</p>}
          </>
        )}
      </div>
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
    </div>
  );
};

export default ReviewList;
