/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Modal, Button, Form, Dropdown } from "react-bootstrap";
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
  const [searchTerm, setSearchTerm] = useState(""); // Search term for filter
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
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

  const handleSort = (column) => {
    let direction = "asc";
    if (sortConfig.key === column && sortConfig.direction === "asc") {
      direction = "desc";
    }

    const sortedKoiList = [...koiList].sort((a, b) => {
      if (a[column] < b[column]) return direction === "asc" ? -1 : 1;
      if (a[column] > b[column]) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setKoiList(sortedKoiList);
    setSortConfig({ key: column, direction });
  };

  const handleEditClick = (koi) => {
    fetch(`https://localhost:7229/api/Image?koiId=${koi.id}`)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch image data");
        return response.json();
      })
      .then((data) => {
        const matchingImage = data.$values.find((img) => img.koiId === koi.id);
        const imageUrl = matchingImage ? matchingImage.urlPath : null;
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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredKoiList = koiList.filter(
    (koi) =>
      koi.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      koi.species.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">Available Koi Fish</h2>

      {/* Search Bar */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by Origin or Species"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      <Button
        variant="primary"
        onClick={() => navigate("/dashboard/koifish/create")}
        className="btn btn-success btn-sm"
        style={{ marginBottom: "10px" }}
      >
        Add New Koi
      </Button>

      <table className="table table-striped table-bordered mt-4">
        <thead>
          <tr>
            <th scope="col" onClick={() => handleSort("id")}>
              ID{" "}
              {sortConfig.key === "id"
                ? sortConfig.direction === "asc"
                  ? "↑"
                  : "↓"
                : ""}
            </th>
            <th scope="col" onClick={() => handleSort("origin")}>
              Origin{" "}
              {sortConfig.key === "origin"
                ? sortConfig.direction === "asc"
                  ? "↑"
                  : "↓"
                : ""}
            </th>
            <th scope="col" onClick={() => handleSort("gender")}>
              Gender{" "}
              {sortConfig.key === "gender"
                ? sortConfig.direction === "asc"
                  ? "↑"
                  : "↓"
                : ""}
            </th>
            <th scope="col" onClick={() => handleSort("species")}>
              Species{" "}
              {sortConfig.key === "species"
                ? sortConfig.direction === "asc"
                  ? "↑"
                  : "↓"
                : ""}
            </th>
            <th scope="col" onClick={() => handleSort("size")}>
              Size (cm){" "}
              {sortConfig.key === "size"
                ? sortConfig.direction === "asc"
                  ? "↑"
                  : "↓"
                : ""}
            </th>
            <th scope="col" onClick={() => handleSort("price")}>
              Price (VND){" "}
              {sortConfig.key === "price"
                ? sortConfig.direction === "asc"
                  ? "↑"
                  : "↓"
                : ""}
            </th>
            <th scope="col" onClick={() => handleSort("status")}>
              Status{" "}
              {sortConfig.key === "status"
                ? sortConfig.direction === "asc"
                  ? "↑"
                  : "↓"
                : ""}
            </th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredKoiList.map((koi) => (
            <tr key={koi.id}>
              <td>{koi.id}</td>
              <td>{koi.origin}</td>
              <td>{koi.gender}</td>
              <td>{koi.species}</td>
              <td>{koi.size}</td>
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
                      to={`/dashboard/koifish/${koi.id}`}
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

      {/* Show Deleted Koi Table Only if There Are Deleted Koi */}
      {deletedKoi.length > 0 && (
        <>
          <h2 className="text-center mb-4 mt-5">Deleted Koi Fish</h2>
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
                    <Button
                      variant="success"
                      onClick={() => toggleKoiStatus(koi.id, koi.isDeleted)}
                    >
                      Restore
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* Edit Koi Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Koi Fish</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* Origin Dropdown */}
            <Form.Group controlId="formOrigin">
              <Form.Label>Origin</Form.Label>
              <Form.Control
                as="select"
                value={selectedKoi?.origin || ""}
                onChange={(e) => handleFieldEdit("origin", e.target.value)}
              >
                <option value="">Select Origin</option>
                <option value="Vietnam">Vietnam</option>
                <option value="Japan">Japan</option>
                <option value="Thailand">Thailand</option>
                <option value="China">China</option>
                <option value="South Korea">South Korea</option>
                <option value="India">India</option>
              </Form.Control>
            </Form.Group>

            {/* Gender Checkbox */}
            <Form.Group controlId="formGender">
              <Form.Label>Gender</Form.Label>
              <div>
                <Form.Check
                  inline
                  type="checkbox"
                  label="Male"
                  checked={selectedKoi?.gender === "Male"}
                  onChange={(e) =>
                    handleFieldEdit("gender", e.target.checked ? "Male" : "")
                  }
                />
                <Form.Check
                  inline
                  type="checkbox"
                  label="Female"
                  checked={selectedKoi?.gender === "Female"}
                  onChange={(e) =>
                    handleFieldEdit("gender", e.target.checked ? "Female" : "")
                  }
                />
              </div>
            </Form.Group>

            {/* Species Checkbox */}
            <Form.Group controlId="formSpecies">
              <Form.Label>Species</Form.Label>
              <div>
                {[
                  "Showa",
                  "Asagi",
                  "Karashi",
                  "Kohaku",
                  "Shusui",
                  "Sanke",
                  "Tancho",
                  "Shiro Utsuri",
                ].map((species) => (
                  <Form.Check
                    key={species}
                    inline
                    type="checkbox"
                    label={species}
                    checked={selectedKoi?.species.includes(species)}
                    onChange={(e) => {
                      const newSpecies = e.target.checked
                        ? [...(selectedKoi?.species || []), species]
                        : selectedKoi?.species.filter((s) => s !== species);
                      handleFieldEdit("species", newSpecies);
                    }}
                  />
                ))}
              </div>
            </Form.Group>

            {/* Size Input */}
            <Form.Group controlId="formSize">
              <Form.Label>Size (cm)</Form.Label>
              <Form.Control
                type="number"
                value={selectedKoi?.size || ""}
                onChange={(e) => {
                  const size = e.target.value;
                  if (size >= 0) {
                    handleFieldEdit("size", size);
                  }
                }}
              />
            </Form.Group>

            {/* Price Input */}
            <Form.Group controlId="formPrice">
              <Form.Label>Price (VND)</Form.Label>
              <Form.Control
                type="number"
                value={selectedKoi?.price || ""}
                onChange={(e) => {
                  const price = e.target.value;
                  if (price >= 10000) {
                    handleFieldEdit("price", price);
                  }
                }}
              />
            </Form.Group>

            {/* Image Upload */}
            <Form.Group controlId="formImage">
              <Form.Label>Image</Form.Label>
              <Form.Control type="file" onChange={handleImageChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={
              !selectedKoi?.origin ||
              !selectedKoi?.gender ||
              selectedKoi?.species.length === 0 ||
              selectedKoi?.size < 0 ||
              selectedKoi?.price < 10000
            }
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default KoiFishList;
