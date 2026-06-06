"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import useReviewMutation from "@/components/hook/use-review-mutation";
import useReviewQuery, {
  type ReviewData,
} from "@/components/hook/use-review-query";

const RATING_LABELS = ["", "Poor", "Fair", "Good", "Great", "Excellent"];

const AVATAR_COLORS = [
  "bg-teal-100 text-teal-700",
  "bg-purple-100 text-purple-700",
  "bg-orange-100 text-orange-700",
  "bg-blue-100 text-blue-700",
];

interface Review {
  id: number;
  name: string;
  initials: string;
  date: string;
  rating: number;
  content: string;
  avatarColor: string;
}

type ReviewSectionProps = {
  selectedService: number | null;
};

const getInitials = (name: string) => {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
  return initials || "YO";
};

const formatDate = (value?: string) => {
  if (!value) return "Recently";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently";
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const mapReview = (review: ReviewData, index: number): Review => {
  const name = review.patientName || review.patient?.name || "You";
  return {
    id: review.id,
    name,
    initials: getInitials(name),
    date: formatDate(review.createdAt),
    rating: Number(review.rating) || 0,
    content: review.content,
    avatarColor: AVATAR_COLORS[index % AVATAR_COLORS.length],
  };
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${
            i <= rating
              ? "fill-amber-400 text-amber-400"
              : "fill-none text-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

function ReviewItem({ review }: { review: Review }) {
  return (
    <div className="py-4 border-b border-gray-100 last:border-0">
      <div className="flex items-start gap-3">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${review.avatarColor}`}
        >
          {review.initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <p className="text-sm font-medium text-gray-900 truncate">
              {review.name}
            </p>
            <StarRating rating={review.rating} />
          </div>
          <p className="text-xs text-gray-400 mb-1.5">{review.date}</p>
          <p className="text-sm text-gray-500 leading-relaxed">
            {review.content}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ReviewSection({ selectedService }: ReviewSectionProps) {
  const [hovered, setHovered] = useState(0);
  const [selected, setSelected] = useState(0);
  const [content, setContent] = useState("");
  const reviewMutation = useReviewMutation();
  const { data = [], isLoading } = useReviewQuery(selectedService);

  if (!selectedService) return null;

  const reviews = data.map(mapReview);
  const activeRating = hovered || selected;
  const canSubmit =
    selected > 0 && content.trim().length > 0 && !reviewMutation.isPending;

  const handleSubmit = () => {
    if (!selectedService) {
      toast.error("Please select a service before leaving a review.");
      return;
    }
    if (!canSubmit) return;
    reviewMutation.mutate(
      {
        dentalServiceId: selectedService,
        rating: String(selected),
        content: content.trim(),
      },
      {
        onSuccess: () => {
          setSelected(0);
          setHovered(0);
          setContent("");
        },
      },
    );
  };

  return (
    <div className="lg:col-span-3 mt-2">
      <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">
            Patient Reviews
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Showing reviews for the selected service.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
          {/* Leave a review */}
          <div className="p-6">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-4">
              Leave a review
            </p>

            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-500 shrink-0">
                You
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    aria-label={`${val} star${val > 1 ? "s" : ""}`}
                    onMouseEnter={() => setHovered(val)}
                    onMouseLeave={() => setHovered(0)}
                    onClick={() => setSelected(val)}
                    disabled={reviewMutation.isPending}
                    className="p-0.5 rounded transition-transform hover:scale-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Star
                      className={`w-6 h-6 transition-colors ${
                        val <= activeRating
                          ? "fill-amber-400 text-amber-400"
                          : "fill-none text-gray-300"
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-1.5 text-xs text-gray-400 min-w-[52px]">
                  {activeRating ? RATING_LABELS[activeRating] : "Tap to rate"}
                </span>
              </div>
            </div>

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value.slice(0, 400))}
              placeholder="Share your experience..."
              rows={4}
              disabled={reviewMutation.isPending}
              className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-300 focus:bg-white transition-colors leading-relaxed disabled:cursor-not-allowed disabled:opacity-60"
            />

            <div className="flex items-center justify-between mt-2.5">
              <span className="text-xs text-gray-400">
                {content.length} / 400
              </span>
              <button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="bg-primary text-white text-sm font-medium rounded-lg px-5 py-2 transition-opacity hover:opacity-80 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {reviewMutation.isPending ? "Posting..." : "Post review"}
              </button>
            </div>
          </div>

          <div className="p-6">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">
              Reviews
              {reviews.length > 0 && (
                <span className="ml-2 normal-case font-normal">
                  ({reviews.length})
                </span>
              )}
            </p>

            <div className="max-h-80 overflow-y-auto pr-1 -mr-1">
              {isLoading ? (
                <p className="text-sm text-gray-400 py-4">Loading reviews...</p>
              ) : reviews.length > 0 ? (
                reviews.map((review) => (
                  <ReviewItem key={review.id} review={review} />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center mb-3">
                    <Star className="w-5 h-5 text-gray-300" />
                  </div>
                  <p className="text-sm font-medium text-gray-500">
                    No reviews yet
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Be the first to leave one!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
