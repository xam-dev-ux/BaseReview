import { Star } from 'lucide-react';
import { getStarRating } from '../../utils/format';

interface StarRatingProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  showNumber?: boolean;
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

export function StarRating({
  rating,
  size = 'md',
  showNumber = false,
  interactive = false,
  onChange,
}: StarRatingProps) {
  const { fullStars, hasHalfStar, emptyStars } = getStarRating(rating);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const starSize = sizeClasses[size];

  const handleClick = (index: number) => {
    if (interactive && onChange) {
      onChange(index + 1);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {[...Array(fullStars)].map((_, i) => (
        <Star
          key={`full-${i}`}
          className={`${starSize} fill-yellow-400 text-yellow-400 ${
            interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''
          }`}
          onClick={() => handleClick(i)}
        />
      ))}
      {hasHalfStar && (
        <Star
          className={`${starSize} text-yellow-400`}
          style={{
            background: 'linear-gradient(90deg, #FBBF24 50%, transparent 50%)',
          }}
        />
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Star
          key={`empty-${i}`}
          className={`${starSize} text-gray-300 ${
            interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''
          }`}
          onClick={() => handleClick(fullStars + (hasHalfStar ? 1 : 0) + i)}
        />
      ))}
      {showNumber && (
        <span className="ml-2 text-sm font-medium text-gray-700">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
