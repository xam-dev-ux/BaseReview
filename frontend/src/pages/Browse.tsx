import { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useApps } from '../hooks/useReviews';
import { AppCard } from '../components/app/AppCard';
import { LoadingSpinner } from '../components/shared/LoadingSpinner';
import { Category, CATEGORY_LABELS, VerificationStatus } from '../types';

export function Browse() {
  const { data: apps, isLoading } = useApps();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<VerificationStatus | null>(null);
  const [sortBy, setSortBy] = useState<'rating' | 'reviews' | 'date'>('rating');

  // Filter apps
  const filteredApps = apps?.filter((app) => {
    const matchesSearch =
      !searchQuery ||
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.url.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === null || app.category === selectedCategory;
    const matchesStatus = selectedStatus === null || app.verificationStatus === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Sort apps
  const sortedApps = [...(filteredApps || [])].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return Number(b.averageRating) - Number(a.averageRating);
      case 'reviews':
        return Number(b.totalReviews) - Number(a.totalReviews);
      case 'date':
        return Number(b.registrationDate) - Number(a.registrationDate);
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Browse Apps</h1>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name or URL..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-12"
            />
          </div>

          {/* Filters Row */}
          <div className="flex items-center gap-4">
            <SlidersHorizontal size={20} className="text-gray-600" />

            {/* Category Filter */}
            <select
              value={selectedCategory ?? ''}
              onChange={(e) =>
                setSelectedCategory(e.target.value ? Number(e.target.value) : null)
              }
              className="input"
            >
              <option value="">All Categories</option>
              {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus ?? ''}
              onChange={(e) =>
                setSelectedStatus(e.target.value ? Number(e.target.value) : null)
              }
              className="input"
            >
              <option value="">All Status</option>
              <option value={VerificationStatus.OFFICIAL}>Official</option>
              <option value={VerificationStatus.DEVELOPER_VERIFIED}>Developer Verified</option>
              <option value={VerificationStatus.COMMUNITY_VERIFIED}>Community Verified</option>
              <option value={VerificationStatus.UNVERIFIED}>Unverified</option>
              <option value={VerificationStatus.FLAGGED_SUSPICIOUS}>Flagged</option>
              <option value={VerificationStatus.CONFIRMED_SCAM}>Confirmed Scam</option>
            </select>

            {/* Sort */}
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="input">
              <option value="rating">Highest Rated</option>
              <option value="reviews">Most Reviewed</option>
              <option value="date">Recently Added</option>
            </select>

            {/* Clear Filters */}
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory(null);
                setSelectedStatus(null);
              }}
              className="btn btn-secondary whitespace-nowrap"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <LoadingSpinner text="Loading apps..." />
        ) : sortedApps.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No apps match your filters</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory(null);
                setSelectedStatus(null);
              }}
              className="btn btn-primary"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-600">
              Showing {sortedApps.length} app{sortedApps.length !== 1 ? 's' : ''}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedApps.map((app) => (
                <AppCard key={app.appId.toString()} app={app} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
