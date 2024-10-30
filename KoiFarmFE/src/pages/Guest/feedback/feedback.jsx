import React, { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const ProductReviews = () => {
  const navigate = useNavigate();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3);

  const [newFeedback, setNewFeedback] = useState({
    accountId: 3, // Set mặc định là role member
    status: "Pending",
    description: "",
    rating: 0,
  });
  const [hoveredRating, setHoveredRating] = useState(0);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

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

  const handleCreateFeedback = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      if (
        window.confirm("Vui lòng đăng nhập để đánh giá. Chuyển đến trang chủ?")
      ) {
        navigate("/login");
      }
      return;
    }

    if (newFeedback.rating === 0) {
      alert("Vui lòng chọn số sao đánh giá!");
      return;
    }

    setSubmitLoading(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const response = await fetch("https://localhost:7229/api/Feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newFeedback),
      });

      if (!response.ok) {
        throw new Error("Failed to create feedback");
      }

      // Reset form
      setNewFeedback({
        accountId: 3,
        status: "Pending",
        description: "",
        rating: 0,
      });
      setSubmitSuccess(true);
      fetchFeedbacks(); // Refresh list
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const renderStars = (rating, interactive = false) => {
    return [...Array(5)].map((_, index) => (
      <FaStar
        key={index}
        style={{
          color:
            index < (interactive ? hoveredRating || newFeedback.rating : rating)
              ? "#00A67E"
              : "#dadce0",
          marginRight: "2px",
          cursor: interactive ? "pointer" : "default",
          fontSize: interactive ? "24px" : "16px",
        }}
        onMouseEnter={() => interactive && setHoveredRating(index + 1)}
        onMouseLeave={() => interactive && setHoveredRating(0)}
        onClick={() =>
          interactive && setNewFeedback({ ...newFeedback, rating: index + 1 })
        }
      />
    ));
  };

  // Pagination logic
  const totalPages = Math.ceil(feedbacks.length / itemsPerPage);
  const indexOfLastFeedback = currentPage * itemsPerPage;
  const indexOfFirstFeedback = indexOfLastFeedback - itemsPerPage;
  const currentFeedbacks = feedbacks.slice(
    indexOfFirstFeedback,
    indexOfLastFeedback
  );

  const renderPagination = () => {
    return (
      <div className="d-flex justify-content-center align-items-center gap-2 mt-4">
        <button
          className="btn btn-outline-primary"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          style={{
            minWidth: "40px",
            height: "40px",
            borderRadius: "4px",
          }}
        >
          <IoIosArrowBack />
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
          <button
            key={number}
            onClick={() => setCurrentPage(number)}
            className={`btn ${
              number === currentPage ? "btn-primary" : "btn-outline-primary"
            }`}
            style={{
              minWidth: "40px",
              height: "40px",
              borderRadius: "4px",
            }}
          >
            {number}
          </button>
        ))}

        <button
          className="btn btn-outline-primary"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          style={{
            minWidth: "40px",
            height: "40px",
            borderRadius: "4px",
          }}
        >
          <IoIosArrowForward />
        </button>
      </div>
    );
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

  return (
    <div className="container py-4">
      <h2 className="mb-4">Xếp hạng và đánh giá</h2>

      {/* Create Feedback Form */}
      <div className="card mb-4">
        <div className="card-body">
          <form onSubmit={handleCreateFeedback}>
            <div className="mb-3">
              <label className="form-label">Đánh giá của bạn</label>
              <div className="mb-2">
                {renderStars(newFeedback.rating, true)}
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                Nhận xét của bạn
              </label>
              <textarea
                className="form-control"
                id="description"
                rows="3"
                value={newFeedback.description}
                onChange={(e) =>
                  setNewFeedback({
                    ...newFeedback,
                    description: e.target.value,
                  })
                }
                required
                placeholder="Chia sẻ trải nghiệm của bạn..."
              ></textarea>
            </div>
            {submitError && (
              <div className="alert alert-danger mb-3">{submitError}</div>
            )}
            {submitSuccess && (
              <div className="alert alert-success mb-3">
                Đánh giá của bạn đã được gửi thành công!
              </div>
            )}
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitLoading}
            >
              {submitLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Đang gửi...
                </>
              ) : (
                "Gửi đánh giá"
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Reviews list */}
      <div className="reviews-list">
        {currentFeedbacks.map((feedback) => (
          <div key={feedback.id} className="mb-4 pb-4 border-bottom">
            <div className="d-flex gap-3 mb-2">
              <div
                className="rounded-circle text-white d-flex align-items-center justify-content-center"
                style={{
                  width: "40px",
                  height: "40px",
                  backgroundColor: `#${Math.floor(
                    Math.random() * 16777215
                  ).toString(16)}`,
                }}
              >
                {feedback.accountId}
              </div>
              <div>
                <h6 className="mb-1">User ID: {feedback.accountId}</h6>
                <div className="d-flex align-items-center gap-2">
                  <div>{renderStars(feedback.rating)}</div>
                  <small className="text-muted">
                    {new Date(feedback.createdDate).toLocaleDateString()}
                  </small>
                </div>
              </div>
            </div>

            <div className="ms-5 ps-2">
              <p className="mb-3">{feedback.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && renderPagination()}
    </div>
  );
};

export default ProductReviews;
