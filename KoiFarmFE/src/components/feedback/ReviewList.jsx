import React from "react";
import { FaStar } from "react-icons/fa";

const ReviewList = ({ feedbacks }) => {
  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <FaStar
        key={index}
        style={{
          color: index < rating ? "#00A67E" : "#dadce0",
          marginRight: "2px",
          fontSize: "16px",
        }}
      />
    ));
  };

  return (
    <div className="reviews-list">
      {feedbacks.map((feedback) => (
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
  );
};
export default ReviewList;
