import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';
import { useApps, useRegisterApp, useSubmitReview } from '../hooks/useReviews';
import { useWallet } from '../hooks/useWallet';
import { ReviewType, TAG_LABELS, Category, CATEGORY_LABELS } from '../types';
import { parseEther } from 'ethers';

export function WriteReviewNew() {
  const navigate = useNavigate();
  const { data: apps } = useApps();
  const { isConnected } = useWallet();
  const registerApp = useRegisterApp();
  const submitReview = useSubmitReview();

  // Step control
  const [step, setStep] = useState<'search' | 'register' | 'review'>('search');
  const [selectedAppId, setSelectedAppId] = useState<number | null>(null);

  // Search
  const [searchQuery, setSearchQuery] = useState('');

  // New app data
  const [appName, setAppName] = useState('');
  const [appUrl, setAppUrl] = useState('');
  const [appCategory, setAppCategory] = useState<Category>(Category.Other);
  const [appDescription, setAppDescription] = useState('');

  // Review data
  const [rating, setRating] = useState(5);
  const [reviewType, setReviewType] = useState<ReviewType>(ReviewType.GENERAL);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [reviewText, setReviewText] = useState('');
  const [proofText, setProofText] = useState('');
  const [txHashes, setTxHashes] = useState('');

  const filteredApps = apps?.filter(
    (app) =>
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectExistingApp = (appId: number) => {
    setSelectedAppId(appId);
    setStep('review');
  };

  const handleRegisterNewApp = () => {
    setStep('register');
  };

  const handleRegisterAndReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      // Step 1: Register the app
      const metadata = {
        name: appName,
        description: appDescription,
        logo: '',
        screenshots: [],
        category: CATEGORY_LABELS[appCategory],
        website: appUrl,
      };

      await registerApp.mutateAsync({
        name: appName,
        url: appUrl,
        category: appCategory,
        contractAddresses: [],
        metadata,
      });

      // Note: To get the exact appId from the registration, we would need to parse
      // the event logs from the transaction receipt. For now, we redirect the user
      // to browse and find their newly registered app to write the review.

      alert('App registered successfully! Please find your app in the list to write your review.');
      navigate('/browse');
    } catch (error: any) {
      console.error('Error:', error);
      alert(`Failed: ${error.message}`);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected || !selectedAppId) {
      alert('Please connect your wallet and select an app');
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

      const stake = parseEther('0.0000001');

      await submitReview.mutateAsync({
        appId: selectedAppId,
        rating,
        reviewType,
        tags: selectedTags,
        reviewData,
        proofData,
        txHashes: txHashesArray.length > 0 ? txHashesArray : undefined,
        stake,
      });

      alert('Review submitted successfully!');
      navigate(`/app/${selectedAppId}`);
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
          to="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft size={20} />
          Back to Home
        </Link>

        <div className="bg-white rounded-xl shadow-sm border p-8">
          <h1 className="text-3xl font-bold mb-2">Write a Review</h1>
          <p className="text-gray-600 mb-6">
            Review any Base app - whether it's already listed or not
          </p>

          {!isConnected && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-800">
                Please connect your wallet to continue. A minimum stake of 0.0000001 ETH is required.
              </p>
            </div>
          )}

          {/* Step 1: Search or Register */}
          {step === 'search' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Step 1: Find or Add the App</h2>

              {/* Search existing apps */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Existing Apps
                </label>
                <div className="relative mb-4">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search by name or URL..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input pl-12"
                  />
                </div>

                {searchQuery && filteredApps && filteredApps.length > 0 && (
                  <div className="border rounded-lg divide-y max-h-60 overflow-y-auto">
                    {filteredApps.slice(0, 5).map((app) => (
                      <button
                        key={app.appId.toString()}
                        onClick={() => handleSelectExistingApp(Number(app.appId))}
                        className="w-full text-left p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="font-semibold">{app.name}</div>
                        <div className="text-sm text-gray-600">{app.url}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Register new app */}
              <div className="border-t pt-6">
                <h3 className="font-semibold mb-2">App not listed?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Register a new app to review. This helps protect the community from unlisted scams.
                </p>
                <button
                  onClick={handleRegisterNewApp}
                  className="btn btn-primary"
                  disabled={!isConnected}
                >
                  Register New App & Write Review
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Register New App */}
          {step === 'register' && (
            <form onSubmit={handleRegisterAndReview}>
              <div className="mb-6">
                <button
                  type="button"
                  onClick={() => setStep('search')}
                  className="text-sm text-gray-600 hover:text-gray-900 mb-4"
                >
                  ← Back to search
                </button>
              </div>

              <h2 className="text-xl font-bold mb-4">Register New App</h2>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    App Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                    className="input"
                    required
                    placeholder="e.g., SuperSwap DEX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    App URL <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    value={appUrl}
                    onChange={(e) => setAppUrl(e.target.value)}
                    className="input"
                    required
                    placeholder="https://example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={appCategory}
                    onChange={(e) => setAppCategory(Number(e.target.value))}
                    className="input"
                    required
                  >
                    {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={appDescription}
                    onChange={(e) => setAppDescription(e.target.value)}
                    className="input min-h-[80px]"
                    placeholder="Brief description of the app..."
                  />
                </div>
              </div>

              <div className="border-t pt-6">
                <p className="text-sm text-gray-600 mb-4">
                  After registering the app, you'll be able to write your review.
                </p>
                <button
                  type="submit"
                  disabled={!isConnected || registerApp.isPending}
                  className="btn btn-primary w-full"
                >
                  {registerApp.isPending ? 'Registering...' : 'Register App & Continue to Review'}
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Write Review */}
          {step === 'review' && selectedAppId && (
            <form onSubmit={handleSubmitReview}>
              <div className="mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setStep('search');
                    setSelectedAppId(null);
                  }}
                  className="text-sm text-gray-600 hover:text-gray-900 mb-4"
                >
                  ← Change app
                </button>
              </div>

              <h2 className="text-xl font-bold mb-4">Write Your Review</h2>

              <div className="space-y-6">
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
                    placeholder="Share your detailed experience..."
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
                    placeholder="0x123...&#10;0xabc..."
                  />
                </div>

                {/* Submit */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={!isConnected || submitReview.isPending}
                    className="btn btn-primary flex-1"
                  >
                    {submitReview.isPending ? 'Submitting...' : 'Submit Review (0.0000001 ETH)'}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
