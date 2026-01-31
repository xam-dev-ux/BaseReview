import { useState } from 'react';
import { ThumbsUp, ThumbsDown, AlertCircle } from 'lucide-react';
import { Review, ReviewType } from '../../types';
import { StarRating } from '../shared/StarRating';
import { ReputationBadge } from '../shared/ReputationBadge';
import { TagBadge } from '../shared/TagBadge';
import { formatAddress, formatTimeAgo } from '../../utils/format';
import { useVoteHelpful } from '../../hooks/useReviews';
import { fetchFromIPFS } from '../../utils/ipfs';

interface ReviewCardProps {
  review: Review;
  showAppName?: boolean;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const [reviewText, setReviewText] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState(false);
  const voteHelpful = useVoteHelpful();

  // Load review text from IPFS
  useState(() => {
    if (review.reviewIPFS) {
      fetchFromIPFS<any>(review.reviewIPFS).then((data) => {
        if (data?.reviewText) {
          setReviewText(data.reviewText);
        }
      });
    }
  });

  const handleVote = async (isHelpful: boolean) => {
    try {
      await voteHelpful.mutateAsync({
        reviewId: Number(review.reviewId),
        isHelpful,
      });
    } catch (error) {
      console.error('Vote failed:', error);
    }
  };

  const getReviewTypeStyle = () => {
    switch (review.reviewType) {
      case ReviewType.SCAM_REPORT:
        return 'border-l-4 border-danger bg-red-50';
      case ReviewType.WARNING:
        return 'border-l-4 border-warning bg-orange-50';
      case ReviewType.POSITIVE:
        return 'border-l-4 border-success bg-green-50';
      default:
        return '';
    }
  };

  const displayText = isExpanded
    ? reviewText
    : reviewText.slice(0, 200) + (reviewText.length > 200 ? '...' : '');

  return (
    <div className={`card ${getReviewTypeStyle()}`}>
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm text-gray-700">
            {formatAddress(review.reviewer)}
          </span>
          <ReputationBadge
            score={Number(review.reviewerReputationAtTime)}
            showLabel={false}
            size="sm"
          />
        </div>

        <div className="flex items-center gap-2">
          {review.reviewType === ReviewType.SCAM_REPORT && (
            <span className="badge badge-scam flex items-center gap-1">
              <AlertCircle size={12} />
              Scam Report
            </span>
          )}
          {review.reviewType === ReviewType.WARNING && (
            <span className="badge badge-flagged">Warning</span>
          )}
          <span className="text-xs text-gray-500">
            {formatTimeAgo(review.timestamp)}
          </span>
        </div>
      </div>

      {/* Rating */}
      <div className="mb-3">
        <StarRating rating={review.rating} size="sm" showNumber />
      </div>

      {/* Tags */}
      {review.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {review.tags.map((tagId) => (
            <TagBadge key={tagId} tagId={tagId} />
          ))}
        </div>
      )}

      {/* Review Text */}
      {reviewText && (
        <div className="mb-4">
          <p className="text-gray-700 text-sm whitespace-pre-wrap">{displayText}</p>
          {reviewText.length > 200 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-base-primary text-sm font-medium mt-2 hover:underline"
            >
              {isExpanded ? 'Show less' : 'Read more'}
            </button>
          )}
        </div>
      )}

      {/* Proof */}
      {review.proofIPFS && (
        <div className="text-xs text-gray-600 mb-3">
          <span className="font-medium">Evidence provided:</span>{' '}
          <a
            href={`https://ipfs.io/ipfs/${review.proofIPFS}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-base-primary hover:underline"
          >
            View proof
          </a>
        </div>
      )}

      {/* Helpful Votes */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleVote(true)}
            disabled={voteHelpful.isPending}
            className="btn btn-secondary text-xs flex items-center gap-1 py-1 px-2"
          >
            <ThumbsUp size={14} />
            Helpful ({review.helpfulScore > 0 ? review.helpfulScore.toString() : '0'})
          </button>
          <button
            onClick={() => handleVote(false)}
            disabled={voteHelpful.isPending}
            className="btn btn-secondary text-xs flex items-center gap-1 py-1 px-2"
          >
            <ThumbsDown size={14} />
          </button>
        </div>

        {review.lastEdited > 0 && (
          <span className="text-xs text-gray-500">
            Edited {formatTimeAgo(review.lastEdited)}
          </span>
        )}
      </div>

      {/* Developer Response */}
      {review.developerResponse && (
        <div className="mt-4 ml-4 p-3 bg-blue-50 rounded-lg border-l-2 border-base-primary">
          <p className="text-xs font-medium text-base-primary mb-1">
            Developer Response:
          </p>
          <p className="text-sm text-gray-700">{review.developerResponse}</p>
        </div>
      )}
    </div>
  );
}
