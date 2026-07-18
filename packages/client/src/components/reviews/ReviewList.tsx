import { useEffect, useState } from "react";
import axios from "axios";

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
    <div>
      {reviewData?.reviews.map((review) => (
        <div key={review.id}>
          <h3>{review.author}</h3>
          <p>Rating: {review.rating}</p>
          <p>{review.content}</p>
          {/* <p>Created at: {review.createdAt}</p> */}
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
