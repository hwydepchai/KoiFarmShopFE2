import React, { useState, useEffect } from "react";
import Pagination from "../../../components/feedback/Pagination";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const FeedbackPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [newFeedback, setNewFeedback] = useState({
    description: "",
    rating: 0,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isButtonPressed, setIsButtonPressed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchFeedbacks = async () => {
    try {
      const response = await fetch("https://localhost:7229/api/Feedback");
      const data = await response.json();

      // Sort feedbacks by createdDate in descending order (newest first)
      const sortedFeedbacks = data.$values.sort(
        (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
      );

      setFeedbacks(sortedFeedbacks);
    } catch (err) {
      console.error("Failed to load feedbacks");
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  // Reset to first page when new feedback is added
  useEffect(() => {
    setCurrentPage(1);
  }, [feedbacks.length]);

  const totalPages = Math.ceil(feedbacks.length / itemsPerPage);
  const indexOfLastFeedback = currentPage * itemsPerPage;
  const indexOfFirstFeedback = indexOfLastFeedback - itemsPerPage;
  const currentFeedbacks = feedbacks.slice(
    indexOfFirstFeedback,
    indexOfLastFeedback
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to the top of the feedbacks section
    document
      .getElementById("recent-feedbacks")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newFeedback.rating === 0) {
      setError("Please select a rating");
      return;
    }
    if (!newFeedback.description.trim()) {
      setError("Please enter your feedback");
      return;
    }

    setLoading(true);
    setError("");
    setIsButtonPressed(true);

    try {
      const response = await fetch("https://localhost:7229/api/Feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accountId: 1,
          status: "active",
          description: newFeedback.description,
          rating: newFeedback.rating,
        }),
      });

      if (response.ok) {
        setSuccess(true);
        setNewFeedback({ description: "", rating: 0 });
        await fetchFeedbacks(); // Refetch to get the updated list
        setCurrentPage(1); // Reset to first page to show the new feedback
        setTimeout(() => {
          setSuccess(false);
          setIsButtonPressed(false);
        }, 3000);
      } else {
        setError("Failed to submit feedback");
        setIsButtonPressed(false);
      }
    } catch (err) {
      setError("Error submitting feedback");
      setIsButtonPressed(false);
    } finally {
      setLoading(false);
    }
  };

  const StarRating = ({
    rating,
    interactive = false,
    onRate,
    hoveredRating = 0,
  }) => {
    return (
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={() => interactive && onRate(star)}
            onMouseEnter={() => interactive && setHoveredRating(star)}
            onMouseLeave={() => interactive && setHoveredRating(0)}
            className={`text-3xl cursor-pointer select-none ${
              interactive ? "hover:scale-110 transition-transform" : ""
            }`}
          >
            {interactive
              ? hoveredRating >= star || newFeedback.rating >= star
                ? "★"
                : "☆"
              : rating >= star
              ? "★"
              : "☆"}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Submit New Feedback */}
      <div className="bg-white rounded-lg p-6 mb-10">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Submit New Feedback
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-600 mb-2">Rating</label>
            <StarRating
              rating={newFeedback.rating}
              hoveredRating={hoveredRating}
              interactive={true}
              onRate={(rating) => setNewFeedback({ ...newFeedback, rating })}
            />
          </div>

          <div>
            <textarea
              value={newFeedback.description}
              onChange={(e) =>
                setNewFeedback({ ...newFeedback, description: e.target.value })
              }
              className="w-full min-h-[120px] p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 resize-none"
              placeholder="Write your feedback here..."
            />
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          {success && (
            <div className="text-green-500 text-sm">
              Feedback submitted successfully!
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`relative overflow-hidden bg-orange-500 text-white px-6 py-2 rounded-sm 
              hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed transition-colors
              ${isButtonPressed ? "submit-button-pressed" : ""}`}
            style={{
              transform: isButtonPressed ? "scale(0.95)" : "scale(1)",
              transition: "transform 0.1s ease-in-out",
            }}
          >
            <div className="relative z-10">
              {loading ? "Submitting..." : "Submit Feedback"}
            </div>
            {isButtonPressed && (
              <div
                className="absolute inset-0 bg-orange-600"
                style={{
                  animation: "ripple 0.6s linear",
                  borderRadius: "50%",
                }}
              />
            )}
          </button>
        </form>
      </div>

      {/* Recent Feedbacks */}
      <div id="recent-feedbacks">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Recent Feedbacks
        </h2>

        <div className="space-y-4">
          {currentFeedbacks.map((feedback) => (
            <div
              key={feedback.id}
              className="bg-white p-6 border border-gray-100"
            >
              <div className="flex justify-between items-start">
                <StarRating rating={feedback.rating} />
                <span className="text-sm text-gray-500">
                  {new Date(feedback.createdDate).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-700 mt-3">{feedback.description}</p>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      <style jsx>{`
        @keyframes ripple {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          100% {
            transform: scale(4);
            opacity: 0;
          }
        }

        .submit-button-pressed {
          transform: scale(0.95);
        }
      `}</style>
    </div>
  );
};

export default FeedbackPage;
