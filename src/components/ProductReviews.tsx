import { useState } from "react";
import { Star, ThumbsUp, ChevronDown } from "lucide-react";

interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
  helpfulCount?: number;
}

interface ProductReviewsProps {
  reviews: Review[];
  productId: string;
  averageRating: number;
  totalReviews: number;
}

export function ProductReviews({ reviews, productId, averageRating, totalReviews }: ProductReviewsProps) {
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [sortBy, setSortBy] = useState("recent");
  const [filterRating, setFilterRating] = useState<number | null>(null);

  const handleSubmitReview = () => {
    // BACKEND API PLACEHOLDER: Submit review
    // TODO: Implement POST /api/products/:id/reviews with { rating, comment }
    console.log('Submit review:', { productId, ...newReview });
    setIsWritingReview(false);
    setNewReview({ rating: 5, comment: "" });
  };

  const handleMarkHelpful = (reviewId: string) => {
    // BACKEND API PLACEHOLDER: Mark review as helpful
    // TODO: Implement POST /api/reviews/:id/helpful
    console.log('Mark helpful:', reviewId);
  };

  // Calculate rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => {
    const count = reviews.filter((r) => Math.floor(r.rating) === rating).length;
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    return { rating, count, percentage };
  });

  // Filter and sort reviews
  let displayedReviews = [...reviews];
  if (filterRating) {
    displayedReviews = displayedReviews.filter((r) => Math.floor(r.rating) === filterRating);
  }
  if (sortBy === "helpful") {
    displayedReviews.sort((a, b) => (b.helpfulCount || 0) - (a.helpfulCount || 0));
  }

  return (
    <div className="mb-16">
      <h2 className="text-3xl font-bold text-white mb-8">Customer Reviews</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Rating Summary */}
        <div className="bg-gray-900 rounded-xl p-6">
          <div className="text-center mb-6">
            <div className="text-5xl font-bold text-white mb-2">{averageRating}</div>
            <div className="flex items-center justify-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(averageRating)
                      ? 'text-yellow-500 fill-yellow-500'
                      : 'text-gray-600'
                  }`}
                />
              ))}
            </div>
            <div className="text-gray-400">{totalReviews} reviews</div>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {ratingDistribution.map(({ rating, count, percentage }) => (
              <button
                key={rating}
                onClick={() => setFilterRating(filterRating === rating ? null : rating)}
                className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors ${
                  filterRating === rating ? 'bg-gray-800' : 'hover:bg-gray-800'
                }`}
              >
                <span className="text-sm text-white w-8">{rating} ★</span>
                <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-400 w-8 text-right">{count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Write Review */}
        <div className="lg:col-span-2 bg-gray-900 rounded-xl p-6">
          {!isWritingReview ? (
            <div className="text-center">
              <h3 className="text-xl font-semibold text-white mb-4">Share Your Experience</h3>
              <p className="text-gray-400 mb-6">
                Have you purchased this product? Write a review to help others!
              </p>
              <button
                onClick={() => setIsWritingReview(true)}
                className="px-8 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors"
              >
                Write a Review
              </button>
            </div>
          ) : (
            <div>
              <h3 className="text-xl font-semibold text-white mb-6">Write Your Review</h3>

              {/* Rating Selection */}
              <div className="mb-6">
                <label className="block text-white font-semibold mb-3">Your Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setNewReview({ ...newReview, rating })}
                      className="p-2 transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          rating <= newReview.rating
                            ? 'text-yellow-500 fill-yellow-500'
                            : 'text-gray-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Text */}
              <div className="mb-6">
                <label className="block text-white font-semibold mb-3">Your Review</label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  placeholder="Share your thoughts about this product..."
                  className="w-full h-32 px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-white resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleSubmitReview}
                  className="px-8 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Submit Review
                </button>
                <button
                  onClick={() => setIsWritingReview(false)}
                  className="px-8 py-3 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sort Options */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">
          {filterRating ? `${filterRating} Star Reviews` : 'All Reviews'} ({displayedReviews.length})
        </h3>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 bg-gray-900 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-white cursor-pointer"
        >
          <option value="recent">Most Recent</option>
          <option value="helpful">Most Helpful</option>
        </select>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {displayedReviews.length > 0 ? (
          displayedReviews.map((review) => (
            <div key={review.id} className="bg-gray-900 rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-white font-semibold">{review.userName}</span>
                    {review.verified && (
                      <span className="px-2 py-1 bg-green-500/20 text-green-500 text-xs font-semibold rounded">
                        Verified Purchase
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(review.rating)
                              ? 'text-yellow-500 fill-yellow-500'
                              : 'text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-400">
                      {new Date(review.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-gray-300 mb-4">{review.comment}</p>

              <button
                onClick={() => handleMarkHelpful(review.id)}
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                <ThumbsUp className="w-4 h-4" />
                Helpful {review.helpfulCount ? `(${review.helpfulCount})` : ''}
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-gray-900 rounded-xl">
            <p className="text-gray-400">No reviews found for this filter.</p>
          </div>
        )}
      </div>

      {/* Load More (if needed) */}
      {displayedReviews.length > 5 && (
        <div className="text-center mt-8">
          <button className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors mx-auto">
            Load More Reviews
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* BACKEND API PLACEHOLDER: Reviews */}
      {/* TODO: Implement POST /api/products/:id/reviews for submitting reviews */}
      {/* TODO: Implement POST /api/reviews/:id/helpful for marking reviews as helpful */}
      {/* TODO: Implement GET /api/products/:id/reviews?sort=recent&filter=5 for filtered/sorted reviews */}
    </div>
  );
}
