/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import banner from "./koi_banner.jpg"; // Assuming this is your banner image
import "./home.css"; // Assuming you have relevant styles here
import Header from "../Component/Header"; // Make sure to import your Header component if needed

function HomePage() {
  const [koiList, setKoiList] = useState([]); // State for Koi fish list
  const [loading, setLoading] = useState(true); // State for loading status
  const [error, setError] = useState(null); // State for error handling

  useEffect(() => {
    // Fetch the list of Koi from API
    fetch("https://localhost:7229/api/KoiFish")
      .then((response) => response.json())
      .then((data) => {
        if (data && Array.isArray(data.$values)) {
          setKoiList(data.$values); // Set the Koi list from $values
        } else {
          console.error("Expected an array but got:", data);
          setKoiList([]); // Set to empty array if the expected structure is not met
        }
        setLoading(false); // Set loading to false once data is fetched
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        setError(error); // Set error if fetching fails
        setLoading(false); // Also set loading to false on error
      });
  }, []); // Empty dependency array means this runs once on mount

  // Loading state
  if (loading) return <div>Loading...</div>;

  // Error state
  if (error) return <div>Error: {error.message}</div>;

  // Main render
  return (
    <>
      <div className="homepage-container">
        {/* Hero Section */}
        <div className="hero text-center py-5 mb-4">
          <h2 className="mb-3">Looking for Koi</h2>
          <p>Explore our collection of premium koi fish.</p>
        </div>

        {/* Featured Products Section */}
        <section className="featured-products">
          <div className="container">
            <h2 className="text-center mb-4">Featured Koi</h2>
            <div className="row">
              {koiList.map((koi) => (
                <div className="col-md-4 mb-4" key={koi.id}>
                  <div className="card">
                    <img
                      src="/images/koi-placeholder.jpg" // Update with actual image URLs if available
                      className="card-img-top"
                      alt={koi.species}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{koi.species}</h5>
                      <p>
                        <strong>Origin:</strong> {koi.origin}
                      </p>
                      <p>
                        <strong>Price:</strong> ${koi.price}
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
      </div>
    </>
  );
}

export default HomePage;
