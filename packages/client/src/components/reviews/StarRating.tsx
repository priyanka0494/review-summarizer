import { FaRegStar, FaStar } from "react-icons/fa6";

type Props = {
  value: number; //rating from 0 to 5
};

const StarRating = ({ value }: Props) => {
  const placeholderStars = [1, 2, 3, 4, 5];
  return (
    <div className="flex gap-1 text-yellow-500">
      {placeholderStars.map((star) =>
        star <= value ? <FaStar key={star} /> : <FaRegStar key={star} />,
      )}
    </div>
  );
};

export default StarRating;
