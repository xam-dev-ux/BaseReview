import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useApp, useSubmitReview } from '../hooks/useReviews';
import { useWallet } from '../hooks/useWallet';
import { LoadingSpinner } from '../components/shared/LoadingSpinner';
import { ReviewType, TAG_LABELS } from '../types';
import { parseEther } from 'ethers';

export function WriteReview() {
  const { appId } = useParams<{ appId: string }>();
  const navigate = useNavigate();
  const { data: app, isLoading: appLoading } = useApp(Number(appId));
  const { isConnected, account } = useWallet();
  const submitReview = useSubmitReview();

  const [rating, setRating] = useState(5);
  const [reviewType, setReviewType] = useState<ReviewType>(ReviewType.GENERAL);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [reviewText, setReviewText] = useState('');
  const [proofText, setProofText] = useState('');
  const [txHashes, setTxHashes] = useState('');

  if (appLoading) {
    return <LoadingSpinner text="Loading app..." />;
  }

  if (!app) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">App not found</h2>
          <Link to="/browse" className="btn btn-primary">
            Browse Apps
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    if (reviewText.length < 20) {
      alert('Review must be at least 20 characters');
      return;
    }

    try {
      const reviewData = {
        reviewText,
        rating,
        reviewType,
      };

      const proofData = proofText ? { proofText } : undefined;

      const txHashesArray = txHashes
        .split('\n')
        .map((h) => h.trim())
        .filter((h) => h.startsWith('0x'));

      // Minimum stake: 0.0000001 ETH
      const stake = parseEther('0.0000001');

      await submitReview.mutateAsync({
        appId: Number(appId),
        rating,
        reviewType,
        tags: selectedTags,
        reviewData,
        proofData,
        txHashes: txHashesArray.length > 0 ? txHashesArray : undefined,
        stake,
      });

      alert('Review submitted successfully!');
      navigate(`/app/${appId}`);
    } catch (error: any) {
      console.error('Error submitting review:', error);
      alert(`Failed to submit review: ${error.message}`);
    }
  };

  const toggleTag = (tagId: number) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link
          to={`/app/${appId}`}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft size={20} />
          Back to {app.name}
        </Link>

        <div className="bg-white rounded-xl shadow-sm border p-8">
          <h1 className="text-3xl font-bold mb-2">Write a Review</h1>
          <p className="text-gray-600 mb-6">
            Share your experience with <span className="font-semibold">{app.name}</span>
          </p>

          {!isConnected ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-800">
                Please connect your wallet to submit a review. A minimum stake of 0.0000001 ETH is required.
              </p>
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                Connected as: <span className="font-mono">{account}</span>
              </p>
              <p className="text-sm text-blue-800 mt-1">
                Stake required: <span className="font-semibold">0.0000001 ETH</span>
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Review Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Review Type <span className="text-red-500">*</span>
              </label>
              <select
                value={reviewType}
                onChange={(e) => setReviewType(Number(e.target.value))}
                className="input"
                required
              >
                <option value={ReviewType.GENERAL}>General Review</option>
                <option value={ReviewType.POSITIVE}>Positive Experience</option>
                <option value={ReviewType.WARNING}>Warning</option>
                <option value={ReviewType.SCAM_REPORT}>Scam Report</option>
              </select>
              {reviewType === ReviewType.SCAM_REPORT && (
                <p className="text-sm text-red-600 mt-2">
                  Scam reports require evidence. Please provide transaction hashes and detailed proof.
                </p>
              )}
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-4">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setRating(value)}
                      className="hover:scale-110 transition-transform"
                    >
                      <svg
                        className={`w-8 h-8 ${
                          value <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    </button>
                  ))}
                </div>
                <span className="text-lg font-semibold">{rating} / 5</span>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (Optional)
              </label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(TAG_LABELS).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => toggleTag(Number(value))}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedTags.includes(Number(value))
                        ? 'bg-base-primary text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Review Text */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Review <span className="text-red-500">*</span>
              </label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="input min-h-[150px]"
                placeholder="Share your detailed experience with this app..."
                required
                minLength={20}
              />
              <p className="text-sm text-gray-500 mt-1">
                {reviewText.length} / 20 characters minimum
              </p>
            </div>

            {/* Proof */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Evidence/Proof {reviewType === ReviewType.SCAM_REPORT && <span className="text-red-500">*</span>}
              </label>
              <textarea
                value={proofText}
                onChange={(e) => setProofText(e.target.value)}
                className="input min-h-[100px]"
                placeholder="Provide additional evidence or context..."
                required={reviewType === ReviewType.SCAM_REPORT}
              />
            </div>

            {/* Transaction Hashes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transaction Hashes (Optional)
              </label>
              <textarea
                value={txHashes}
                onChange={(e) => setTxHashes(e.target.value)}
                className="input min-h-[80px] font-mono text-sm"
                placeholder="0x123...&#10;0xabc...&#10;One hash per line"
              />
              <p className="text-sm text-gray-500 mt-1">
                Include transaction hashes related to your experience with this app
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={!isConnected || submitReview.isPending}
                className="btn btn-primary flex-1"
              >
                {submitReview.isPending ? (
                  <>
                    <LoadingSpinner />
                    Submitting...
                  </>
                ) : (
                  'Submit Review (0.0000001 ETH stake)'
                )}
              </button>
              <Link to={`/app/${appId}`} className="btn btn-secondary">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
