/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import KoiFishDetails from "../../Admin/Dashboard/KoiManage/koidetails";
import banner from "./koi_banner.jpg";
import "./home.css";
import Header from "../Component/Header";

function HomePage() {
  const [koiList, setKoiList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://localhost:7229/api/KoiFish") // Fetch list of Koi from API
      .then((response) => response.json())
      .then((data) => {
        setKoiList(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      <div className="homepage-container">
        {/* Hero Section */}
        <div className="hero text-center py-5 mb-4">
          <h2 className="mb-3">Looking for Koi</h2>
          <p>Explore our collection of premium koi fish.</p>
        </div>

        {/* Featured Products */}
        <section className="featured-products">
          <div className="container">
            <h2 className="text-center mb-4">Featured Koi</h2>
            <div className="row">
              {koiList.map((koi) => (
                <div className="col-md-4 mb-4" key={koi.id}>
                  <div className="card">
                    <img
                      src="/images/koi-placeholder.jpg"
                      className="card-img-top"
                      alt={koi.species}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{koi.species}</h5>
                      <p>
                        <strong>Origin:</strong> {koi.origin}
                      </p>
                      <p>
                        <strong>Price:</strong> $150
                      </p>
                      <Link
                        to={`/koifish/${koi.id}`}
                        className="btn btn-primary"
                      >
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
