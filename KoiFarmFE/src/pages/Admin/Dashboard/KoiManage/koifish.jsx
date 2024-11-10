/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap"; // Bootstrap for Modal

function KoiFishList() {
  const [koiList, setKoiList] = useState([]);
  const [imageList, setImageList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedKoi, setSelectedKoi] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null); // Track selected image for editing

  const navigate = useNavigate();

  // Fetch koi list and images
  useEffect(() => {
    fetch("https://localhost:7229/api/KoiFish")
      .then((response) => response.json())
      .then((data) => {
        setKoiList(data.$values);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });

    fetch("https://localhost:7229/api/Image")
      .then((response) => response.json())
      .then((data) => {
        setImageList(data.$values);
      })
      .catch((error) => setError(error));
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const activeKoi = koiList.filter((koi) => !koi.isDeleted);
  const deletedKoi = koiList.filter((koi) => koi.isDeleted);

  // Open the Edit modal and fetch koi details
  const handleEditClick = (id) => {
    fetch(`https://localhost:7229/api/KoiFish/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setSelectedKoi(data);
        setShowModal(true);
        // Fetch associated image
        const koiImage = imageList.find((img) => img.koiId === id);
        setSelectedImage(koiImage); // Set selected image
      })
      .catch((error) => setError(error));
  };

  // Handle update of specific property
  const handleFieldEdit = (field, value) => {
    setSelectedKoi((prevKoi) => ({
      ...prevKoi,
      [field]: value,
    }));
  };

  // Handle saving the updated property
  const handleSave = () => {
    if (!selectedKoi) return;
    fetch(`https://localhost:7229/api/KoiFish/${selectedKoi.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(selectedKoi),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update Koi fish");
        }
        setShowModal(false); // Close the modal on success
      })
      .catch((error) => {
        setError(error);
        alert("Error updating Koi fish: " + error.message);
      });
  };

  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Assuming the backend handles image upload and returns the image URL
      const imageUrl = URL.createObjectURL(file); // Preview the selected image
      setSelectedImage({
        ...selectedImage,
        urlPath: imageUrl, // Update the image URL with the new one
      });

      // Here you would typically upload the image to the server
      // and update the koi's associated image with the response.
    }
  };

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">Available Koi Fish</h2>
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Origin</th>
            <th scope="col">Gender</th>
            <th scope="col">Species</th>
            <th scope="col">Size (cm)</th>
            <th scope="col">Price (VND)</th>
            <th scope="col">Status</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {activeKoi.map((koi) => (
            <tr key={koi.id}>
              <td>{koi.id}</td>
              <td>{koi.origin}</td>
              <td>{koi.gender}</td>
              <td>{koi.species}</td>
              <td>{koi.size}</td>
              <td>{koi.price}</td>
              <td>{koi.status}</td>
              <td>
                <Link
                  to={`/dashboard/koifish/${koi.id}`}
                  className="btn btn-primary btn-sm"
                >
                  View Details
                </Link>
                <button
                  className="btn btn-warning btn-sm mx-2"
                  onClick={() => handleEditClick(koi.id)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  // Add delete functionality if needed
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for editing Koi details */}
      {selectedKoi && (
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Koi Fish Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              {/* Image Preview */}
              {selectedImage && (
                <div className="mb-3">
                  <img
                    src={selectedImage.urlPath}
                    alt="Koi Fish"
                    className="img-fluid mb-2"
                    style={{ maxWidth: "300px" }}
                  />
                  <Form.Group controlId="formImage">
                    <Form.Label>Change Image</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </Form.Group>
                </div>
              )}

              <Form.Group controlId="formOrigin">
                <Form.Label>Origin</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedKoi.origin}
                  onChange={(e) => handleFieldEdit("origin", e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="formGender">
                <Form.Label>Gender</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedKoi.gender}
                  onChange={(e) => handleFieldEdit("gender", e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="formSpecies">
                <Form.Label>Species</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedKoi.species}
                  onChange={(e) => handleFieldEdit("species", e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="formSize">
                <Form.Label>Size (cm)</Form.Label>
                <Form.Control
                  type="number"
                  value={selectedKoi.size}
                  onChange={(e) => handleFieldEdit("size", e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="formPrice">
                <Form.Label>Price (VND)</Form.Label>
                <Form.Control
                  type="number"
                  value={selectedKoi.price}
                  onChange={(e) => handleFieldEdit("price", e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="formCategoryId">
                <Form.Label>Category ID</Form.Label>
                <Form.Control
                  type="number"
                  value={selectedKoi.categoryId}
                  onChange={(e) => handleFieldEdit("categoryId", e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="formAge">
                <Form.Label>Age</Form.Label>
                <Form.Control
                  type="number"
                  value={selectedKoi.age}
                  onChange={(e) => handleFieldEdit("age", e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="formCharacter">
                <Form.Label>Character</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedKoi.character}
                  onChange={(e) => handleFieldEdit("character", e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="formAmountFood">
                <Form.Label>Amount Food</Form.Label>
                <Form.Control
                  type="number"
                  value={selectedKoi.amountFood}
                  onChange={(e) => handleFieldEdit("amountFood", e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="formScreeningRate">
                <Form.Label>Screening Rate</Form.Label>
                <Form.Control
                  type="number"
                  value={selectedKoi.screeningRate}
                  onChange={(e) => handleFieldEdit("screeningRate", e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="formType">
                <Form.Label>Type</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedKoi.type}
                  onChange={(e) => handleFieldEdit("type", e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="formStatus">
                <Form.Label>Status</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedKoi.status}
                  onChange={(e) => handleFieldEdit("status", e.target.value)}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}

export default KoiFishList;
