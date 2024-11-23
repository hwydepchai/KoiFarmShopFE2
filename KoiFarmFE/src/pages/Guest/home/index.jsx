import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./home.css";

function HomePage() {
  const [koiList, setKoiList] = useState([]);
  const [feedbackList, setFeedbackList] = useState([]);
  const [error, setError] = useState(null);
  const [accounts, setAccounts] = useState({});

  useEffect(() => {
    // Fetch Koi Data
    const fetchKoiFishData = async () => {
      try {
        const koiResponse = await fetch("https://localhost:7229/api/KoiFish");
        const koiData = await koiResponse.json();

        const imageResponse = await fetch("https://localhost:7229/api/Image");
        const imageData = await imageResponse.json();

        const koiArray = koiData.$values || [];
        const imageArray = imageData.$values || [];

        // Filter koi with status = Active
        const activeKoiArray = koiArray.filter(
          (koi) => koi.status === "Active"
        );

        const koiWithImages = activeKoiArray.map((koi) => {
          const matchedImage = imageArray.find(
            (image) => image.koiId === koi.id
          );
          return {
            ...koi,
            UrlPath: matchedImage
              ? matchedImage.urlPath
              : "/images/koi-placeholder.jpg",
          };
        });

        setKoiList(koiWithImages);
      } catch (error) {
        console.error("Fetch error:", error);
        setError(error);
      }
    };

    // Fetch Feedback Data
    const fetchFeedbackData = async () => {
      try {
        const feedbackResponse = await fetch(
          "https://localhost:7229/api/Feedback"
        );
        const feedbackData = await feedbackResponse.json();

        const feedbackArray = feedbackData.$values || [];

        // Sort feedback by createdDate and get the top 3 newest feedback
        const sortedFeedback = feedbackArray
          .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate))
          .slice(0, 3);

        setFeedbackList(sortedFeedback);
      } catch (error) {
        console.error("Fetch error:", error);
        setError(error);
      }
    };

    // Fetch Account Data for feedback users
    const fetchAccountData = async () => {
      try {
        const accountResponse = await fetch(
          "https://localhost:7229/api/Accounts"
        );
        const accountData = await accountResponse.json();

        const accountMap = accountData.$values.reduce((acc, account) => {
          acc[account.id] = account.name;
          return acc;
        }, {});

        setAccounts(accountMap);
      } catch (error) {
        console.error("Fetch error:", error);
        setError(error);
      }
    };

    fetchKoiFishData();
    fetchFeedbackData();
    fetchAccountData();
  }, []);

  if (error) return <div>Error: {error.message}</div>;

  // Sort koi by price in descending order and get the top 3
  const topKoi = [...koiList].sort((a, b) => b.price - a.price).slice(0, 3);

  const renderStarRating = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <div>
        {"★".repeat(fullStars)}
        {halfStar && "☆"}
        {"☆".repeat(emptyStars)}
      </div>
    );
  };

  return (
    <div className="homepage-container">
      <div className="hero text-center py-5 mb-4">
        <h2 className="mb-3">Looking for Koi</h2>
        <p>Explore our collection of premium koi fish.</p>
      </div>

      <section className="featured-products">
        <div className="container">
          <h2 className="text-center mb-4">Featured Koi</h2>
          <div className="row">
            {topKoi.map((koi) => (
              <div className="col-md-4 mb-4" key={koi.id}>
                <div className="card koi-card">
                  <img
                    src={koi.UrlPath}
                    className="card-img-top"
                    alt={koi.species}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{koi.species}</h5>
                    <h>
                      <strong>Origin:</strong> {koi.origin}
                    </h>
                    <p>
                      <strong>Price:</strong> {koi.price} VND
                    </p>
                    <Link to={`/koifish/${koi.id}`} className="btn btn-primary">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="feedback-section">
        <div className="container">
          <h2 className="text-center mb-4">Latest Feedback</h2>
          <div className="row">
            {feedbackList.map((feedback) => (
              <div className="col-md-4 mb-4" key={feedback.id}>
                <div className="card feedback-card">
                  <div
                    className="card-body"
                    style={{ position: "relative", height: "fit-content" }}
                  >
                    {/* Name at top-left */}
                    <div className="d-flex justify-content-between">
                      <h2 style={{ marginBottom: "1px" }}>
                        <strong>{accounts[feedback.accountId]}</strong>
                      </h2>
                      <span style={{ fontSize: "12px", color: "gray" }}>
                        {new Date(feedback.createdDate).toLocaleString()}
                      </span>
                    </div>

                    {/* Rating below the name */}
                    <h3>
                      <strong>{renderStarRating(feedback.rating)}</strong>
                    </h3>

                    {/* Description */}
                    <p>{feedback.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
