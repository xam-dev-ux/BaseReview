import { Link } from 'react-router-dom';
import { Search, Shield, Users, AlertTriangle, TrendingUp } from 'lucide-react';
import { useApps } from '../hooks/useReviews';
import { AppCard } from '../components/app/AppCard';
import { LoadingSpinner } from '../components/shared/LoadingSpinner';
import { EmbedMetadata } from '../components/shared/EmbedMetadata';
import { VerificationStatus } from '../types';

export function Home() {
  const { data: apps, isLoading } = useApps();

  const featuredApps = apps?.slice(0, 6) || [];
  const flaggedApps = apps?.filter(
    (app) => app.verificationStatus === VerificationStatus.FLAGGED_SUSPICIOUS ||
             app.verificationStatus === VerificationStatus.CONFIRMED_SCAM
  ).slice(0, 3) || [];

  return (
    <>
      <EmbedMetadata
        title="BaseReview - Community Watchdog"
        imageUrl="/hero.png"
        buttonTitle="Open BaseReview"
        actionUrl="/"
        actionName="Launch BaseReview"
      />
      <div className="min-h-screen">
        {/* Hero Section */}
      <div className="bg-gradient-to-br from-base-primary to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">
              Don't Get Scammed. Check BaseReview First.
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Community-powered reviews for Base MiniApps. By users, for users.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-12">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search MiniApp by name or URL..."
                  className="w-full pl-12 pr-4 py-4 rounded-lg text-gray-900 text-lg focus:outline-none focus:ring-2 focus:ring-white"
                />
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div>
                <div className="text-3xl font-bold">{apps?.length || 0}</div>
                <div className="text-blue-100">Apps Reviewed</div>
              </div>
              <div>
                <div className="text-3xl font-bold">{flaggedApps.length}</div>
                <div className="text-blue-100">Scams Flagged</div>
              </div>
              <div>
                <div className="text-3xl font-bold">100%</div>
                <div className="text-blue-100">Transparent</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-base-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="text-base-primary" size={32} />
              </div>
              <h3 className="font-bold mb-2">1. Search</h3>
              <p className="text-sm text-gray-600">Find any Base MiniApp</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-base-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-base-primary" size={32} />
              </div>
              <h3 className="font-bold mb-2">2. Read</h3>
              <p className="text-sm text-gray-600">Check reviews, ratings, scam reports</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-base-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-base-primary" size={32} />
              </div>
              <h3 className="font-bold mb-2">3. Decide</h3>
              <p className="text-sm text-gray-600">Use app confidently or avoid scams</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-base-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="text-base-primary" size={32} />
              </div>
              <h3 className="font-bold mb-2">4. Contribute</h3>
              <p className="text-sm text-gray-600">Leave your own review to help others</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recently Flagged */}
      {flaggedApps.length > 0 && (
        <div className="bg-red-50 py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-3 mb-8">
              <AlertTriangle className="text-danger" size={32} />
              <h2 className="text-3xl font-bold">Recently Flagged Apps</h2>
            </div>
            <div className="grid grid-cols-3 gap-6">
              {flaggedApps.map((app) => (
                <AppCard key={app.appId.toString()} app={app} />
              ))}
            </div>
            <div className="text-center mt-8">
              <Link to="/browse?filter=flagged" className="btn btn-danger">
                View All Flagged Apps
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Featured Apps */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Featured Apps</h2>
          {isLoading ? (
            <LoadingSpinner text="Loading apps..." />
          ) : (
            <div className="grid grid-cols-3 gap-6">
              {featuredApps.map((app) => (
                <AppCard key={app.appId.toString()} app={app} />
              ))}
            </div>
          )}
          <div className="text-center mt-8">
            <Link to="/browse" className="btn btn-primary">
              Browse All Apps
            </Link>
          </div>
        </div>
      </div>

      {/* Why BaseReview */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why BaseReview?</h2>
          <div className="grid grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="flex gap-4">
              <Shield className="text-base-primary flex-shrink-0" size={24} />
              <div>
                <h3 className="font-bold mb-2">Community-driven</h3>
                <p className="text-sm text-gray-600">
                  Not company-controlled. Real reviews from real users.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Shield className="text-base-primary flex-shrink-0" size={24} />
              <div>
                <h3 className="font-bold mb-2">Immutable Reviews</h3>
                <p className="text-sm text-gray-600">
                  Reviews stored on blockchain - cannot be deleted by developers.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Shield className="text-base-primary flex-shrink-0" size={24} />
              <div>
                <h3 className="font-bold mb-2">Reputation System</h3>
                <p className="text-sm text-gray-600">
                  Prevents fake reviews with built-in reputation scoring.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Shield className="text-base-primary flex-shrink-0" size={24} />
              <div>
                <h3 className="font-bold mb-2">Scam Detection</h3>
                <p className="text-sm text-gray-600">
                  Community flags protect your funds from malicious apps.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
