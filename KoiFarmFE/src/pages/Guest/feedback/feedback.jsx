import React, { useState, useEffect } from "react";
import CreateFeedbackForm from "../../../components/feedback/CreateFeedbackForm";
import ReviewList from "../../../components/feedback/ReviewList";
import Pagination from "../../../components/feedback/Pagination";

const Feedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3);

  useEffect(() => {
    fetchFeedbacks();
  }, [currentPage]);

  const fetchFeedbacks = async () => {
    try {
      const response = await fetch("https://localhost:7229/api/Feedback");
      if (!response.ok) throw new Error("Failed to fetch feedbacks");
      const data = await response.json();
      setFeedbacks(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center p-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger m-4" role="alert">
        Error: {error}
      </div>
    );
  }

  const totalPages = Math.ceil(feedbacks.length / itemsPerPage);
  const indexOfLastFeedback = currentPage * itemsPerPage;
  const indexOfFirstFeedback = indexOfLastFeedback - itemsPerPage;
  const currentFeedbacks = feedbacks.slice(
    indexOfFirstFeedback,
    indexOfLastFeedback
  );

  return (
    <div className="container py-4">
      <h2 className="mb-4">Xếp hạng và đánh giá</h2>

      <CreateFeedbackForm onFeedbackSubmit={fetchFeedbacks} />

      <ReviewList feedbacks={currentFeedbacks} />

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default Feedbacks;
