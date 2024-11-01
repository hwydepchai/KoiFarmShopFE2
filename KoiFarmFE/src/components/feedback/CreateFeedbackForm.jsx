import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const CreateFeedbackForm = ({ onFeedbackSubmit }) => {
  const navigate = useNavigate();
  const [newFeedback, setNewFeedback] = useState({
    accountId: 3,
    status: "Pending",
    description: "",
    rating: 0,
  });
  const [hoveredRating, setHoveredRating] = useState(0);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      if (
        window.confirm("Vui lòng đăng nhập để đánh giá. Chuyển đến trang chủ?")
      ) {
        navigate("/home");
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

      if (!response.ok) throw new Error("Failed to create feedback");

      setNewFeedback({
        accountId: 3,
        status: "Pending",
        description: "",
        rating: 0,
      });
      setSubmitSuccess(true);
      onFeedbackSubmit(); // Callback to parent to refresh list
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const renderStars = () => {
    return [...Array(5)].map((_, index) => (
      <FaStar
        key={index}
        style={{
          color:
            index < (hoveredRating || newFeedback.rating)
              ? "#00A67E"
              : "#dadce0",
          marginRight: "2px",
          cursor: "pointer",
          fontSize: "24px",
        }}
        onMouseEnter={() => setHoveredRating(index + 1)}
        onMouseLeave={() => setHoveredRating(0)}
        onClick={() => setNewFeedback({ ...newFeedback, rating: index + 1 })}
      />
    ));
  };

  return (
    <div className="card mb-4">
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Đánh giá của bạn</label>
            <div className="mb-2">{renderStars()}</div>
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
            />
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
  );
};
export default CreateFeedbackForm;
