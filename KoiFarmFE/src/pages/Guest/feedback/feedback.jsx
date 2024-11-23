import React, { useState, useEffect } from "react";
import { Container, Form, Button, Card, Pagination } from "react-bootstrap";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import "bootstrap/dist/css/bootstrap.min.css";

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
  const [accountNames, setAccountNames] = useState({}); // Map of accountId to name
  const itemsPerPage = 5;

  const fetchAccountName = async (accountId) => {
    if (accountNames[accountId]) return; // Skip if already fetched
    try {
      const response = await fetch(`https://localhost:7229/api/Accounts/${accountId}`);
      const data = await response.json();
      setAccountNames((prev) => ({ ...prev, [accountId]: data.name }));
    } catch (err) {
      console.error(`Failed to fetch account name for ID: ${accountId}`);
    }
  };

  const fetchFeedbacks = async () => {
    try {
      const response = await fetch("https://localhost:7229/api/Feedback");
      const data = await response.json();
      const sortedFeedbacks = data.$values.sort(
        (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
      );
      setFeedbacks(sortedFeedbacks);

      // Fetch account names for unique account IDs
      const uniqueAccountIds = [...new Set(sortedFeedbacks.map((f) => f.accountId))];
      uniqueAccountIds.forEach(fetchAccountName);
    } catch (err) {
      console.error("Failed to load feedbacks");
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

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
        await fetchFeedbacks();
        setCurrentPage(1);
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
      <div className="d-flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={() => interactive && onRate(star)}
            onMouseEnter={() => interactive && setHoveredRating(star)}
            onMouseLeave={() => interactive && setHoveredRating(0)}
            style={{
              cursor: interactive ? "pointer" : "default",
              fontSize: "1.5rem",
              transition: "transform 0.2s",
              transform:
                interactive && hoveredRating >= star
                  ? "scale(1.1)"
                  : "scale(1)",
            }}
            className="user-select-none"
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
    <Container className="py-5">
      <Card className="mb-4">
        <Card.Body>
          <h1 className="h3 mb-4">Submit New Feedback</h1>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Rating</Form.Label>
              <div>
                <StarRating
                  rating={newFeedback.rating}
                  hoveredRating={hoveredRating}
                  interactive={true}
                  onRate={(rating) =>
                    setNewFeedback({ ...newFeedback, rating })
                  }
                />
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Control
                as="textarea"
                rows={4}
                value={newFeedback.description}
                onChange={(e) =>
                  setNewFeedback({
                    ...newFeedback,
                    description: e.target.value,
                  })
                }
                placeholder="Write your feedback here..."
              />
            </Form.Group>

            {error && <div className="text-danger mb-3">{error}</div>}
            {success && (
              <div className="text-success mb-3">
                Feedback submitted successfully!
              </div>
            )}

            <Button
              type="submit"
              variant="warning"
              disabled={loading}
              className={`position-relative ${isButtonPressed ? "active" : ""}`}
            >
              {loading ? "Submitting..." : "Submit Feedback"}
            </Button>
          </Form>
        </Card.Body>
      </Card>

      <div id="recent-feedbacks">
        <h2 className="h3 mb-4">Recent Feedbacks</h2>

        {currentFeedbacks.map((feedback) => (
          <Card key={feedback.id} className="mb-3">
            <Card.Body>
              <div className="justify-content-between align-items-start">
                <div className="">{accountNames[feedback.accountId] || "Loading..."}</div>
                <StarRating rating={feedback.rating} />
                <small className="text-muted">
                  {new Date(feedback.createdDate).toLocaleDateString()}
                </small>
              </div>
              <p className="mt-3 mb-0">{feedback.description}</p>
            </Card.Body>
          </Card>
        ))}

        {totalPages > 1 && (
          <div className="d-flex justify-content-center mt-4">
            <Pagination>
              <Pagination.Prev
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <IoIosArrowBack />
              </Pagination.Prev>

              {[...Array(totalPages)].map((_, index) => (
                <Pagination.Item
                  key={index + 1}
                  active={currentPage === index + 1}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </Pagination.Item>
              ))}

              <Pagination.Next
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <IoIosArrowForward />
              </Pagination.Next>
            </Pagination>
          </div>
        )}
      </div>
    </Container>
  );
};

export default FeedbackPage;
