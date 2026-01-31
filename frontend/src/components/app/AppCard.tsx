import { Link } from 'react-router-dom';
import { AlertTriangle, ExternalLink } from 'lucide-react';
import { MiniApp, VerificationStatus } from '../../types';
import { StarRating } from '../shared/StarRating';
import { VerificationBadge } from '../shared/VerificationBadge';
import { formatRating, formatAddress, formatNumber } from '../../utils/format';

interface AppCardProps {
  app: MiniApp;
}

export function AppCard({ app }: AppCardProps) {
  const averageRating = formatRating(app.averageRating);
  const isFlagged = app.verificationStatus === VerificationStatus.FLAGGED_SUSPICIOUS ||
                   app.verificationStatus === VerificationStatus.CONFIRMED_SCAM;

  return (
    <Link
      to={`/app/${app.appId}`}
      className="card hover:shadow-lg transition-shadow duration-200 cursor-pointer group"
    >
      <div className="flex flex-col h-full">
        {/* Warning Banner */}
        {isFlagged && (
          <div className="bg-warning/10 border border-warning rounded-lg px-3 py-2 mb-4 flex items-center gap-2">
            <AlertTriangle className="text-warning" size={16} />
            <span className="text-sm font-medium text-warning">
              {app.scamReportsCount.toString()} scam reports
            </span>
          </div>
        )}

        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-base-primary transition-colors">
              {app.name}
            </h3>
            <a
              href={app.url}
              onClick={(e) => e.stopPropagation()}
              className="text-sm text-gray-500 hover:text-base-primary flex items-center gap-1 mt-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              {app.url.replace(/^https?:\/\//, '')}
              <ExternalLink size={12} />
            </a>
          </div>

          <VerificationBadge status={app.verificationStatus} size="sm" />
        </div>

        {/* Rating */}
        <div className="mb-3">
          <div className="flex items-center gap-2">
            <StarRating rating={averageRating} size="sm" />
            <span className="text-sm font-medium text-gray-700">
              {averageRating.toFixed(1)}
            </span>
            <span className="text-xs text-gray-500">
              ({formatNumber(app.totalReviews)} reviews)
            </span>
          </div>
        </div>

        {/* Developer */}
        <div className="text-xs text-gray-600 mb-4">
          Developer: <span className="font-mono">{formatAddress(app.developer)}</span>
        </div>

        {/* Stats */}
        <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between text-sm">
          <div>
            <span className="text-gray-600">Reviews:</span>
            <span className="ml-1 font-medium">{formatNumber(app.totalReviews)}</span>
          </div>
          {Number(app.scamReportsCount) > 0 && (
            <div className="text-warning">
              <AlertTriangle size={14} className="inline mr-1" />
              {app.scamReportsCount.toString()} reports
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
