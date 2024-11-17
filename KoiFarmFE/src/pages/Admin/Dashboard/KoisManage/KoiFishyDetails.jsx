/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Button, Col, Row, Card, Table } from "react-bootstrap";

function KoiFishyDetails() {
  const { id } = useParams(); // Retrieve the koi fish ID from the route parameters
  const [koiDetails, setKoiDetails] = useState(null);
  const [categoryName, setCategoryName] = useState(""); // Store the category name
  const [images, setImages] = useState([]); // Store the images

  useEffect(() => {
    const fetchKoiDetails = async () => {
      try {
        // Fetch koi fish details
        const response = await axios.get(
          `https://localhost:7229/api/KoiFishy/${id}`
        );
        setKoiDetails(response.data);

        // Fetch category details if categoryId is available
        if (response.data.categoryId) {
          try {
            const categoryResponse = await axios.get(
              `https://localhost:7229/api/Category/${response.data.categoryId}`
            );
            setCategoryName(categoryResponse.data.category1);
          } catch (categoryError) {
            console.error("Error fetching category data:", categoryError);
            setCategoryName("Unknown"); // Default if category fetch fails
          }
        }

        // Fetch images related to the koi fish
        const imageResponse = await axios.get(
          `https://localhost:7229/api/Image`
        );
        const koiImages = imageResponse.data.$values.filter(
          (image) => image.koiFishyId === parseInt(id) // Match images by koiFishyId
        );
        setImages(koiImages);
      } catch (error) {
        console.error("Error fetching koi fish details:", error);
      }
    };

    fetchKoiDetails();
  }, [id]);

  if (!koiDetails) return <div>Loading...</div>;

  return (
    <div className="container mt-5">
      {/* Koi Fish Details Section */}
      <h2 className="mb-4 text-center">Koi Fish Details</h2>

      <Row className="mb-4">
        <Col md={9}>
          <Card className="shadow-sm">
            <Card.Body>
              <Table responsive="sm" bordered striped hover>
                <tbody>
                  <tr>
                    <th>ID</th>
                    <td>{koiDetails.id}</td>
                  </tr>
                  <tr>
                    <th>Price</th>
                    <td>{`$${koiDetails.price}`}</td>
                  </tr>
                  <tr>
                    <th>Category</th>
                    <td>{categoryName}</td>
                  </tr>
                  <tr>
                    <th>Category ID</th>
                    <td>{koiDetails.categoryId}</td>
                  </tr>
                  <tr>
                    <th>Quantity</th>
                    <td>{koiDetails.quantity}</td>
                  </tr>
                  <tr>
                    <th>Status</th>
                    <td>{koiDetails.status}</td>
                  </tr>
                  <tr>
                    <th>Created Date</th>
                    <td>
                      {new Date(koiDetails.createdDate).toLocaleDateString()}
                    </td>
                  </tr>
                  <tr>
                    <th>Modified Date</th>
                    <td>
                      {new Date(koiDetails.modifiedDate).toLocaleDateString()}
                    </td>
                  </tr>
                  <tr>
                    <th>Deleted Date</th>
                    <td>
                      {koiDetails.deletedDate
                        ? new Date(koiDetails.deletedDate).toLocaleDateString()
                        : "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <th>Is Deleted</th>
                    <td>{koiDetails.isDeleted ? "True" : "False"}</td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <div className="d-flex justify-content-center align-items-center h-100">
            <Card className="shadow-sm">
              <Card.Body>
                <h4 className="text-center">Koi Fish Images</h4>
                <Row className="g-3">
                  {images.length > 0 ? (
                    images.map((image) => (
                      <Col md={12} key={image.id}>
                        <Card.Img
                          variant="top"
                          src={image.urlPath}
                          alt={`Koi fish image ${image.id}`}
                          className="img-fluid rounded mx-auto d-block border-solid-gray"
                          style={{
                            height: "auto", // Allow the height to adjust based on width
                            width: "100%", // Scale the image to fit the container's width
                            minHeight: "300px", // Minimum height for better scaling
                            objectFit: "cover", // Keep the image aspect ratio intact
                            aspectRatio: "7/3", // Max height for a bigger scale (adjustable)
                          }}
                        />
                      </Col>
                    ))
                  ) : (
                    <Col>
                      <p className="text-center">No images available</p>
                    </Col>
                  )}
                </Row>
              </Card.Body>
            </Card>
          </div>
        </Col>
      </Row>

      {/* Button Section */}
      <div className="text-center mt-4">
        <Button variant="secondary" size="lg" href="/dashboard/koifishy">
          Back to Koi Fish List
        </Button>
      </div>
    </div>
  );
}

export default KoiFishyDetails;
