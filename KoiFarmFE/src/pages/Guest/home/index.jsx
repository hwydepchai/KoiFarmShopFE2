/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./home.css";

function HomePage() {
  const [koiList, setKoiList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchKoiFishData = async () => {
      try {
        const koiResponse = await fetch("https://localhost:7229/api/KoiFish");
        const koiData = await koiResponse.json();

        const imageResponse = await fetch("https://localhost:7229/api/Image");
        const imageData = await imageResponse.json();

        const koiArray = koiData.$values || [];
        const imageArray = imageData.$values || [];

        const koiWithImages = koiArray.map((koi) => {
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
      } finally {
        setLoading(false);
      }
    };

    fetchKoiFishData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  // Sort koi by price in descending order and get the top 3
  const topKoi = [...koiList]
    .sort((a, b) => b.price - a.price)
    .slice(0, 3);

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
                    <p>
                      <strong>Origin:</strong> {koi.origin}
                    </p>
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
    </div>
  );
}

export default HomePage;
