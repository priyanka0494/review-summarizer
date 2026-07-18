import { useEffect, useState } from "react";
import axios from "axios";
import StarRating from "./StarRating";

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
  const [reviewData, setReviewData] = useState<GetReviewsResponse | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await axios.get<GetReviewsResponse>(
          `/api/products/${productId}/reviews`,
        );
        setReviewData(data);
      } catch (error) {
        console.error("Failed to fetch reviews", error);
      }
    };

    fetchReviews();
  }, []);

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
