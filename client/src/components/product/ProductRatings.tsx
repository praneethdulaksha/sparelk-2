import { useState } from "react";
import { ChevronDown, ChevronUp, Star, User, ThumbsUp } from "lucide-react";
import { TReview } from "@/types";

interface ProductRatingsProps {
  rating: number;
  reviewCount: number;
  reviews: TReview[];
}

export function ProductRatings({
  rating,
  reviewCount,
  reviews,
}: ProductRatingsProps) {
  const [expanded, setExpanded] = useState(true);

  // Calculate star distribution
  const starCounts = [0, 0, 0, 0, 0]; // 5, 4, 3, 2, 1 stars

  reviews.forEach((review) => {
    if (review.rate >= 1 && review.rate <= 5) {
      starCounts[5 - review.rate] += 1;
    }
  });

  return (
    <div className="border rounded-xl overflow-hidden" id="reviews">
      <div
        className="flex items-center justify-between p-4 bg-slate-50 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <h2 className="text-xl font-semibold">
          Ratings & Reviews ({reviewCount})
        </h2>
        {expanded ? (
          <ChevronUp className="h-5 w-5 text-slate-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-slate-500" />
        )}
      </div>

      {expanded && (
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Rating summary */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="text-center">
                  <div className="text-7xl font-bold text-slate-900">
                    {rating || 0}
                  </div>
                  <div className="flex justify-center mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-5 w-5 ${
                          star <= rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-slate-200"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-slate-500 mt-2">
                    Based on {reviewCount} reviews
                  </p>
                </div>

                <div className="hidden md:block h-16 border-r border-slate-200 mx-4"></div>

                <div className="flex-1 max-w-xs">
                  <p className="text-sm text-slate-700 mb-3 text-center md:text-left">
                    All reviews come from verified purchasers
                  </p>

                  {/* Star distribution */}
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((starNum) => (
                      <div key={starNum} className="flex items-center gap-2">
                        <div className="text-sm text-slate-700 w-6">
                          {starNum}
                        </div>
                        <div className="flex-shrink-0">
                          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        </div>
                        <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-yellow-400 rounded-full"
                            style={{
                              width:
                                reviewCount > 0
                                  ? `${
                                      (starCounts[5 - starNum] / reviewCount) *
                                      100
                                    }%`
                                  : "0%",
                            }}
                          ></div>
                        </div>
                        <div className="text-sm text-slate-500 w-6 text-right">
                          {starCounts[5 - starNum]}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Review list */}
            <div>
              {reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div
                      key={review._id}
                      className="border-b border-slate-200 pb-6 last:border-0 last:pb-0"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <div className="bg-slate-100 rounded-full p-2">
                            <User className="h-4 w-4 text-slate-500" />
                          </div>
                          <span className="font-medium">{review.user}</span>
                        </div>
                        <span className="text-sm text-slate-500">
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex mt-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= review.rate
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-slate-200"
                            }`}
                          />
                        ))}
                      </div>

                      <p className="mt-3 text-slate-700">{review.comment}</p>

                      {review.sellerFeedback && (
                        <div className="mt-3 bg-slate-50 rounded-md p-3">
                          <div className="flex items-center gap-1 text-sm text-slate-500 mb-1">
                            <ThumbsUp className="h-3 w-3" />
                            <span>Seller Feedback:</span>
                          </div>
                          <p className="text-sm text-slate-600">
                            {review.sellerFeedback.message}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-500">
                    No reviews yet. Be the first to review this product!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
