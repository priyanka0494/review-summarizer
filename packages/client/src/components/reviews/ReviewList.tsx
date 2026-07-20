import { useMutation, useQuery } from "@tanstack/react-query";
import { reviewApi } from "./ReviewsApi";
import type { GetReviewsResponse, SummarizeResponse } from "./ReviewsApi";
import ReviewSkeleton from "./ReviewSkeleton";
import StarRating from "./StarRating";
import { HiSparkles } from "react-icons/hi2";
import { Button } from "../ui/button";

type Props = {
  productId: number;
};

const ReviewList = ({ productId }: Props) => {
  const {
    data: reviewData,
    isLoading,
    error,
  } = useQuery<GetReviewsResponse>({
    queryKey: ["reviews", productId],
    queryFn: () => reviewApi.fetchReviews(productId),
  });

  const {
    mutate: handleSummarize,
    isPending: isSummaryLoading,
    error: isSummaryError,
    data: summarizeResponse,
  } = useMutation<SummarizeResponse>({
    mutationFn: () => reviewApi.summarizeReviews(productId),
  });

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

  const currentSummary = reviewData?.summary || summarizeResponse?.summary;

  return (
    <div>
      <div className={"mb-5"}>
        {currentSummary ? (
          <p>{currentSummary}</p>
        ) : (
          <>
            <Button
              onClick={() => handleSummarize()}
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
            {isSummaryError && (
              <p className="text-red-500">
                {"Could not summarize reviews. Try again!"}
              </p>
            )}
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
