/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Modal, Button, Form, Dropdown } from "react-bootstrap";
import axios from "axios";

function KoiFishy() {
  const [koiList, setKoiyList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedKoi, setSelectedKoi] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // State for the search input
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" }); // Sorting state

  const navigate = useNavigate();

  // Fetch koi list and categories on component mount
  useEffect(() => {
    fetchKoiList();
    fetchCategories();
  }, []);

  // Function to fetch koi list from API
  const fetchKoiList = () => {
    fetch("https://localhost:7229/api/KoiFishy")
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch koi fish data");
        return response.json();
      })
      .then((data) => {
        setKoiyList(data.$values);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  };

  // Function to fetch categories from API
  const fetchCategories = () => {
    fetch("https://localhost:7229/api/Category")
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch categories");
        return response.json();
      })
      .then((data) => {
        setCategories(data.$values);
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  // Search filter function
  const filteredKoiList = koiList.filter((koi) => {
    return (
      koi.id.toString().includes(searchTerm) ||
      getCategoryName(koi.categoryId)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      koi.quantity.toString().includes(searchTerm) ||
      koi.price.toString().includes(searchTerm) ||
      koi.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Sorting function
  const sortKoiList = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    const sortedList = [...filteredKoiList].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setKoiyList(sortedList);
    setSortConfig({ key, direction });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const placeholderImage = "https://via.placeholder.com/300?text=No+Image"; // Placeholder

  const activeKoi = filteredKoiList.filter((koi) => !koi.isDeleted);
  const deletedKoi = filteredKoiList.filter((koi) => koi.isDeleted);

  const handleEditClick = (koi) => {
    fetch(`https://localhost:7229/api/Image?koiFishyId=${koi.id}`)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch image data");
        return response.json();
      })
      .then((data) => {
        const matchedImage = data.$values.find(
          (image) => image.koiFishyId === koi.id
        );
        const imageUrl = matchedImage ? matchedImage.urlPath : null;

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

    // Validate price, quantity, and status before saving
    if (selectedKoi.price < 10000) {
      alert("Price must be at least 10,000 VND.");
      return;
    }
    if (selectedKoi.quantity < 10) {
      alert("Quantity must be at least 10.");
      return;
    }
    if (!/^[a-zA-Z]+$/.test(selectedKoi.status)) {
      alert("Status must contain only letters (a-z, A-Z).");
      return;
    }

    // If validation passes, prepare the form data
    const formData = new FormData();
    for (const key in selectedKoi) {
      if (key !== "imgUrl") formData.append(key, selectedKoi[key]);
    }
    if (selectedImage) formData.append("Img", selectedImage);

    // Send the PUT request to save the changes
    fetch(`https://localhost:7229/api/KoiFishy/${selectedKoi.id}`, {
      method: "PUT",
      headers: { accept: "text/plain" },
      body: formData,
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to update koi fish");
        return response.json();
      })
      .then((updatedKoi) => {
        setKoiyList((prevList) =>
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
      // Call delete API
      await axios.delete(`https://localhost:7229/api/KoiFishy/${id}`);

      // Re-fetch koi list to update the deleted koi table
      fetchKoiList();
    } catch (error) {
      console.error("Error deleting koi fish:", error);
    }
  };

  const toggleKoiStatus = async (id, isDeleted) => {
    try {
      await axios.put(`https://localhost:7229/api/KoiFishy/${id}/${isDeleted}`);
      fetchKoiList(); // Re-fetch koi list to update status
    } catch (error) {
      console.error("Error updating koi status:", error);
    }
  };

  // Function to get category name by id
  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.category1 : "Unknown";
  };

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">Available Koi Fishy</h2>
      <input
        type="text"
        className="form-control"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: "20px" }}
      />
      <Button
        variant="primary"
        onClick={() => navigate("/dashboard/koifishy/create")}
        className="btn btn-success btn-sm"
        style={{ marginBottom: "10px" }}
      >
        Add New Koi Batch
      </Button>
      <br />
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th scope="col" onClick={() => sortKoiList("id")}>
              ID
              {sortConfig.key === "id" &&
                (sortConfig.direction === "asc" ? " ↑" : " ↓")}
            </th>
            <th scope="col" onClick={() => sortKoiList("categoryId")}>
              Category
              {sortConfig.key === "categoryId" &&
                (sortConfig.direction === "asc" ? " ↑" : " ↓")}
            </th>
            <th scope="col" onClick={() => sortKoiList("quantity")}>
              Quantity
              {sortConfig.key === "quantity" &&
                (sortConfig.direction === "asc" ? " ↑" : " ↓")}
            </th>
            <th scope="col" onClick={() => sortKoiList("price")}>
              Price (VND)
              {sortConfig.key === "price" &&
                (sortConfig.direction === "asc" ? " ↑" : " ↓")}
            </th>
            <th scope="col" onClick={() => sortKoiList("status")}>
              Status
              {sortConfig.key === "status" &&
                (sortConfig.direction === "asc" ? " ↑" : " ↓")}
            </th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {activeKoi.map((koi) => (
            <tr key={koi.id}>
              <td>{koi.id}</td>
              <td>{getCategoryName(koi.categoryId)}</td>
              <td>{koi.quantity}</td>
              <td>{koi.price}</td>
              <td>{koi.status}</td>
              <td>
                <Dropdown>
                  <Dropdown.Toggle
                    variant="link"
                    id="dropdown-custom-components"
                    className="text-decoration-none"
                  >
                    <img
                      src="https://cdn-icons-png.flaticon.com/128/2311/2311524.png"
                      alt="more"
                      style={{ height: "20px", cursor: "pointer" }}
                    />
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item
                      as={Link}
                      to={`/dashboard/koifishy/${koi.id}`}
                    >
                      View Details
                    </Dropdown.Item>
                    <Dropdown.Item
                      as="button"
                      className="btn btn-warning btn-sm"
                      onClick={() => handleEditClick(koi)}
                    >
                      Edit
                    </Dropdown.Item>
                    <Dropdown.Item
                      as="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteKoi(koi.id)}
                    >
                      Delete
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
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
            <th scope="col">Category</th>
            <th scope="col">Quantity</th>
            <th scope="col">Price (VND)</th>
            <th scope="col">Status</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {deletedKoi.map((koi) => (
            <tr key={koi.id}>
              <td>{koi.id}</td>
              <td>{getCategoryName(koi.categoryId)}</td>
              <td>{koi.quantity}</td>
              <td>{koi.price}</td>
              <td>{koi.status}</td>
              <td>
                <button
                  className="btn btn-success btn-sm mx-2"
                  onClick={() => toggleKoiStatus(koi.id, false)}
                >
                  Restore
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
            <Modal.Title>Edit Koi Fishy Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formPrice">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedKoi.price}
                  onChange={(e) => handleFieldEdit("price", e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="formQuantity">
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedKoi.quantity}
                  onChange={(e) => handleFieldEdit("quantity", e.target.value)}
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
                <input
                  type="file"
                  onChange={handleImageChange}
                  className="form-control"
                />
                <img
                  src={selectedKoi.imgUrl || placeholderImage}
                  alt="Koi"
                  className="img-fluid mt-2"
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

export default KoiFishy;
