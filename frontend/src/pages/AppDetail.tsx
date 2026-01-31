import { useParams, Link } from 'react-router-dom';
import { ExternalLink, AlertTriangle, ArrowLeft } from 'lucide-react';
import { useApp, useAppReviews } from '../hooks/useReviews';
import { ReviewCard } from '../components/review/ReviewCard';
import { StarRating } from '../components/shared/StarRating';
import { VerificationBadge } from '../components/shared/VerificationBadge';
import { LoadingSpinner } from '../components/shared/LoadingSpinner';
import { EmbedMetadata } from '../components/shared/EmbedMetadata';
import { formatRating, formatTimeAgo, formatNumber } from '../utils/format';
import { VerificationStatus } from '../types';

export function AppDetail() {
  const { appId } = useParams<{ appId: string }>();
  const { data: app, isLoading: appLoading } = useApp(Number(appId));
  const { data: reviews, isLoading: reviewsLoading } = useAppReviews(Number(appId));

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

  const averageRating = formatRating(app.averageRating);
  const isFlagged =
    app.verificationStatus === VerificationStatus.FLAGGED_SUSPICIOUS ||
    app.verificationStatus === VerificationStatus.CONFIRMED_SCAM;

  return (
    <>
      <EmbedMetadata
        title={`${app.name} - BaseReview`}
        imageUrl="/hero.png"
        buttonTitle={`View ${app.name}`}
        actionUrl={`/app/${appId}`}
        actionName={`Open ${app.name} Reviews`}
      />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link to="/browse" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft size={20} />
          Back to Browse
        </Link>

        {/* App Header */}
        <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
          {/* Warning Banner */}
          {isFlagged && (
            <div className="bg-danger/10 border border-danger rounded-lg px-4 py-3 mb-6 flex items-start gap-3">
              <AlertTriangle className="text-danger flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h3 className="font-bold text-danger mb-1">WARNING: This app has been flagged by the community</h3>
                <p className="text-sm text-danger">
                  {app.scamReportsCount.toString()} scam reports filed. Proceed with extreme caution.
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{app.name}</h1>
              <a
                href={app.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base-primary hover:underline flex items-center gap-2"
              >
                {app.url}
                <ExternalLink size={16} />
              </a>
            </div>
            <VerificationBadge status={app.verificationStatus} size="lg" />
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-4 gap-6 pt-6 border-t">
            <div>
              <div className="text-sm text-gray-600 mb-1">Average Rating</div>
              <StarRating rating={averageRating} showNumber />
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Total Reviews</div>
              <div className="text-2xl font-bold">{formatNumber(app.totalReviews)}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Scam Reports</div>
              <div className={`text-2xl font-bold ${isFlagged ? 'text-danger' : ''}`}>
                {app.scamReportsCount.toString()}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Registered</div>
              <div className="text-sm">{formatTimeAgo(app.registrationDate)}</div>
            </div>
          </div>

          {/* Developer Info */}
          <div className="mt-6 pt-6 border-t">
            <div className="text-sm text-gray-600 mb-1">Developer</div>
            <div className="font-mono text-sm">{app.developer}</div>
          </div>

          {/* Contract Addresses */}
          {app.contractAddresses.length > 0 && (
            <div className="mt-4">
              <div className="text-sm text-gray-600 mb-2">Smart Contracts</div>
              <div className="space-y-1">
                {app.contractAddresses.map((address, i) => (
                  <a
                    key={i}
                    href={`https://basescan.org/address/${address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-sm text-base-primary hover:underline block"
                  >
                    {address}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Reviews Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Reviews ({formatNumber(app.totalReviews)})</h2>
            <Link to={`/app/${appId}/review`} className="btn btn-primary">
              Write a Review
            </Link>
          </div>

          {reviewsLoading ? (
            <LoadingSpinner text="Loading reviews..." />
          ) : reviews && reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <ReviewCard key={review.reviewId.toString()} review={review} />
              ))}
            </div>
          ) : (
            <div className="card text-center py-12">
              <p className="text-gray-600 mb-4">No reviews yet. Be the first to review this app!</p>
              <Link to={`/app/${appId}/review`} className="btn btn-primary">
                Write First Review
              </Link>
            </div>
          )}
        </div>
      </div>
      </div>
    </>
  );
}
