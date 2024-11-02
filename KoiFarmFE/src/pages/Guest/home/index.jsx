import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./home.css";

function HomePage() {
  const [koiList, setKoiList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://localhost:7229/api/KoiFish")
      .then((response) => response.json())
      .then((data) => {
        if (data && Array.isArray(data.$values)) {
          const formattedData = data.$values.map((koi) => ({
            ...koi,
            UrlPath: koi.images?.$values?.[0] || "/images/koi-placeholder.jpg", // Default placeholder if no image
          }));
          setKoiList(formattedData);
        } else {
          console.error("Expected an array but got:", data);
          setKoiList([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

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
            {koiList.map((koi) => (
              <div className="col-md-4 mb-4" key={koi.id}>
                <div className="card">
                  <img
                    src={
                      koi.images && koi.images.length > 0
                        ? koi.images[0].urlPath
                        : "/images/koi-placeholder.jpg"
                    }
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
  );
}

export default HomePage;
