/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";

// Helper function to generate image URL
const getImageUrl = (imagePath) => `https://localhost:7229/images/${imagePath}`;

function KoiFishList() {
  const [koiList, setKoiList] = useState([]);
  const [deletedKoi, setDeletedKoi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedKoi, setSelectedKoi] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newKoi, setNewKoi] = useState({
    origin: "",
    gender: "",
    species: "",
    size: 0,
    price: 0,
    status: "",
    imgUrl: "",
  });

  const navigate = useNavigate();

  // Fetch koi list on component mount
  useEffect(() => {
    fetchKoiList();
  }, []);

  const fetchKoiList = () => {
    fetch("https://localhost:7229/api/KoiFish")
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch koi fish data");
        return response.json();
      })
      .then((data) => {
        const activeKoi = data.$values.filter((koi) => !koi.isDeleted);
        const deletedKoi = data.$values.filter((koi) => koi.isDeleted);
        setKoiList(activeKoi);
        setDeletedKoi(deletedKoi);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const handleEditClick = (koi) => {
    fetch(`https://localhost:7229/api/Image?koiId=${koi.id}`)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch image data");
        return response.json();
      })
      .then((data) => {
        const imageUrl =
          data.$values.length > 0 ? data.$values[0].urlPath : null;
        setSelectedKoi({
          ...koi,
          imgUrl: imageUrl,
        });
        setShowModal(true);
      })
      .catch((error) => {
        setError(error.message);
        setShowModal(true);
      });
  };

  const handleFieldEdit = (field, value) => {
    setSelectedKoi((prevKoi) => ({
      ...prevKoi,
      [field]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(file);
      setSelectedKoi((prev) => ({ ...prev, imgUrl: imageUrl }));
    }
  };

  const handleSave = () => {
    if (!selectedKoi) return;

    const formData = new FormData();
    for (const key in selectedKoi) {
      if (key !== "imgUrl") formData.append(key, selectedKoi[key]);
    }
    if (selectedImage) formData.append("Img", selectedImage);

    fetch(`https://localhost:7229/api/KoiFish/${selectedKoi.id}`, {
      method: "PUT",
      headers: { accept: "text/plain" },
      body: formData,
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to update koi fish");
        return response.json();
      })
      .then((updatedKoi) => {
        setKoiList((prevList) =>
          prevList.map((koi) => (koi.id === updatedKoi.id ? updatedKoi : koi))
        );
        setShowModal(false);
      })
      .catch((error) => {
        setError(error.message);
        alert("Error updating koi fish: " + error.message);
      });
  };

  const deleteKoi = async (id) => {
    try {
      await axios.delete(`https://localhost:7229/api/KoiFish/${id}`);
      fetchKoiList(); // Refresh the koi list
    } catch (error) {
      console.error("Error deleting koi fish:", error);
    }
  };

  const toggleKoiStatus = async (id, isDeleted) => {
    try {
      await axios.put(`https://localhost:7229/api/KoiFish/${id}/${!isDeleted}`);
      fetchKoiList(); // Refresh koi list to reflect status change
    } catch (error) {
      console.error("Error updating koi status:", error);
    }
  };

  const handleAddFieldChange = (field, value) => {
    setNewKoi((prevKoi) => ({
      ...prevKoi,
      [field]: value,
    }));
  };

  const handleAddImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setNewKoi((prev) => ({ ...prev, imgUrl: imageUrl }));
      setSelectedImage(file);
    }
  };

  const handleAddSave = async () => {
    const formData = new FormData();
    for (const key in newKoi) {
      formData.append(key, newKoi[key]);
    }
    if (selectedImage) formData.append("Img", selectedImage);

    try {
      await axios.post("https://localhost:7229/api/KoiFish", formData);
      fetchKoiList(); // Refresh koi list after adding new koi
      setShowAddModal(false); // Close modal after saving
    } catch (error) {
      console.error("Error adding koi fish:", error);
    }
  };

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">Available Koi Fish</h2>
      <Button variant="primary" onClick={() => navigate("/dashboard/koifish/create")}>
        Add New Koi
      </Button>

      <table className="table table-striped table-bordered mt-4">
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
          {koiList.map((koi) => (
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
                  onClick={() => handleEditClick(koi)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm mx-2"
                  onClick={() => deleteKoi(koi.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 className="text-center my-4">Deleted Koi Fish</h3>
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
          {deletedKoi.map((koi) => (
            <tr key={koi.id}>
              <td>{koi.id}</td>
              <td>{koi.origin}</td>
              <td>{koi.gender}</td>
              <td>{koi.species}</td>
              <td>{koi.size}</td>
              <td>{koi.price}</td>
              <td>{koi.status}</td>
              <td>
                <button
                  className="btn btn-success btn-sm mx-2"
                  onClick={() => toggleKoiStatus(koi.id, koi.isDeleted)}
                >
                  Restore
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Modal */}
      {showModal && selectedKoi && (
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Koi Fish</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
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

              <Form.Group controlId="formStatus">
                <Form.Label>Status</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedKoi.status}
                  onChange={(e) => handleFieldEdit("status", e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="formImage">
                <Form.Label>Image</Form.Label>
                <Form.Control type="file" onChange={handleImageChange} />
                {selectedKoi.imgUrl && (
                  <img
                    src={selectedKoi.imgUrl}
                    alt="Selected Koi"
                    className="img-fluid mt-2"
                  />
                )}
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
