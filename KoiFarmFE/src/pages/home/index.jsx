/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import KoiFishDetails from "../koiFish";

function HomePage() {
  const [koiList, setKoiList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const openDetailHandler = (orchid) => {
    
  };

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
    <div className="container">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            Koi Farm Shop
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link active" href="#">
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Koi for Sale
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Pond Equipment
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Care Guides
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="hero bg-light text-center py-5 mb-4">
        <img src="koi_banner.jpg" alt="Koi Pond" className="img-fluid mb-3" />
        <h2 className="mb-3">Find Your Perfect Koi</h2>
        <p>Explore our collection of premium koi fish and pond accessories.</p>
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
                    <Link to={`/koi/${koi.id}`} className="btn btn-primary">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer text-center py-4">
        <p>© 2024 Koi Farm Shop. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default HomePage;
