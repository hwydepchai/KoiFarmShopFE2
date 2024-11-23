/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Modal, Button, Form, Dropdown, Row, Col } from "react-bootstrap";
import axios from "axios";

// Helper function to generate image URL
const getImageUrl = (imagePath) => `https://localhost:7229/images/${imagePath}`;

function KoiFishList() {
  const [koiList, setKoiList] = useState([]);
  const [deletedKoi, setDeletedKoi] = useState([]);
  const [soldKoi, setSoldKoi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showSoldKoiModal, setShowSoldKoiModal] = useState(false); // New state for sold koi modal
  const [selectedKoi, setSelectedKoi] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
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
        const activeKoi = data.$values.filter(
          (koi) => koi.status === "Active" || koi.status === "Pending"
        );
        const soldKoi = data.$values.filter(
          (koi) => koi.status === "Sold" && !koi.isDeleted
        );
        const deletedKoi = data.$values.filter(
          (koi) => koi.status === "Inactive" || koi.isDeleted
        );

        setKoiList(activeKoi);
        setSoldKoi(soldKoi);
        setDeletedKoi(deletedKoi);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  };

  // New function to sort sold koi by modified date
  const sortedSoldKoi = soldKoi.sort(
    (a, b) => new Date(b.modifiedDate) - new Date(a.modifiedDate)
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
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

  const filteredKoiList = koiList.filter(
    (koi) =>
      koi.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      koi.variety.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">Available Koi Fish</h2>

      {/* Search Bar */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by Origin or variety"
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

      {/* Button to Show Sold Koi Modal */}
      <Button
        variant="info"
        onClick={() => setShowSoldKoiModal(true)}
        className="btn btn-info btn-sm"
        style={{ marginBottom: "10px", marginLeft: "10px" }}
      >
        View Sold Koi
      </Button>

      {/* Sold Koi Modal */}
      <Modal show={showSoldKoiModal} onHide={() => setShowSoldKoiModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Sold Koi Fish</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price (VND)</th>
              </tr>
            </thead>
            <tbody>
              {sortedSoldKoi.map((koi) => (
                <tr key={koi.id}>
                  <td>{koi.id}</td>
                  <td>{koi.name}</td>
                  <td>{koi.variety}</td>
                  <td>{koi.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowSoldKoiModal(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

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
            <th
              scope="col ```javascriptreact
              "
              onClick={() => handleSort("name")}
            >
              Name{" "}
              {sortConfig.key === "name"
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
            <th scope="col" onClick={() => handleSort("variety")}>
              Variety{" "}
              {sortConfig.key === "variety"
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
              <td>{koi.name}</td>
              <td>{koi.origin}</td>
              <td>{koi.gender}</td>
              <td>{koi.variety}</td>
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
                <th scope="col">Name</th>
                <th scope="col">Origin</th>
                <th scope="col">Gender</th>
                <th scope="col">Variety</th>
                <th scope="col">Price (VND)</th>
                <th scope="col">Status</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {deletedKoi.map((koi) => (
                <tr key={koi.id}>
                  <td>{koi.id}</td>
                  <td>{koi.name}</td>
                  <td>{koi.origin}</td>
                  <td>{koi.gender}</td>
                  <td>{koi.variety}</td>
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
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={selectedKoi?.name || ""}
                onChange={(e) => handleFieldEdit("name", e.target.value)}
              />
            </Form.Group>
            {/* Dropdown Inputs */}
            <Row>
              <Col md={6}>
                {/* Origin Dropdown */}
                <Form.Group controlId="formOrigin">
                  <Form.Label>Origin</Form.Label>
                  <Form.Control
                    as="select"
                    value={selectedKoi?.origin || ""}
                    onChange={(e) => handleFieldEdit("origin", e.target.value)}
                  >
                    <option value="Vietnam">Vietnam</option>
                    <option value="Japan">Japan</option>
                    <option value="Thailand">Thailand</option>
                    <option value="China">China</option>
                    <option value="South Korea">South Korea</option>
                    <option value="India">India</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={6}>
                {/* Variety Dropdown */}
                <Form.Group controlId="formVariety">
                  <Form.Label>Variety</Form.Label>
                  <Form.Control
                    as="select"
                    value={selectedKoi?.variety || ""}
                    onChange={(e) => handleFieldEdit("variety", e.target.value)}
                  >
                    <option value="Kohaku">Kohaku</option>
                    <option value="Showa Sanke">Showa Sanke</option>
                    <option value="Utsuri">Utsuri</option>
                    <option value="Asagi">Asagi</option>
                    <option value="Shusui">Shusui</option>
                    <option value="Ginrin">Ginrin</option>
                    <option value="Ogon">Ogon</option>
                    <option value="Tancho">Tancho</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={6}>
                {/* Character Dropdown */}
                <Form.Group controlId="formCharacter">
                  <Form.Label>Character</Form.Label>
                  <Form.Control
                    as="select"
                    value={selectedKoi?.character || ""}
                    onChange={(e) =>
                      handleFieldEdit("character", e.target.value)
                    }
                  >
                    <option value="Calm">Calm</option>
                    <option value="Friendly">Friendly</option>
                    <option value="Aggressive">Aggressive</option>
                    <option value="Playful">Playful</option>
                    <option value="Shy">Shy</option>
                    <option value="Curious">Curious</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={6}>
                {/* Type Dropdown */}
                <Form.Group controlId="formType">
                  <Form.Label>Type</Form.Label>
                  <Form.Control
                    as="select"
                    value={selectedKoi?.type || ""}
                    onChange={(e) => handleFieldEdit("type", e.target.value)}
                  >
                    <option value="Imported">Imported</option>
                    <option value="F1">F1</option>
                    <option value="Native">Native</option>
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>

            {/* Number Inputs */}
            <Row>
              <Col md={6}>
                {/* Year of Birth Input */}
                <Form.Group controlId="formYearOfBirth">
                  <Form.Label>Year of Birth</Form.Label>
                  <Form.Control
                    type="number"
                    value={selectedKoi?.yearOfBirth || ""}
                    onChange={(e) =>
                      handleFieldEdit("yearOfBirth", e.target.value)
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                {/* Size Input */}
                <Form.Group controlId="formSize">
                  <Form.Label>Size (cm)</Form.Label>
                  <Form.Control
                    type="number"
                    value={selectedKoi?.size || ""}
                    onChange={(e) => handleFieldEdit("size", e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                {/* Amount of Food Input */}
                <Form.Group controlId="formAmountFood">
                  <Form.Label>Amount of Food (kg)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.1"
                    value={selectedKoi?.amountFood || ""}
                    onChange={(e) =>
                      handleFieldEdit("amountFood", e.target.value)
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                {/* Screening Rate Input */}
                <Form.Group controlId="formScreeningRate">
                  <Form.Label>Screening Rate (%)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.1"
                    value={selectedKoi?.screeningRate || ""}
                    onChange={(e) =>
                      handleFieldEdit("screeningRate", e.target.value)
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                {/* Price Input */}
                <Form.Group controlId="formPrice">
                  <Form.Label>Price (VND)</Form.Label>
                  <Form.Control
                    type="number"
                    value={selectedKoi?.price || ""}
                    onChange={(e) => handleFieldEdit("price", e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                {/* Gender Radio Buttons */}
                <Form.Group controlId="formGender">
                  <Form.Label>Gender</Form.Label>
                  <div>
                    <Form.Check
                      inline
                      type="radio"
                      label="Male"
                      name="gender"
                      value="Male"
                      checked={selectedKoi?.gender === "Male"}
                      onChange={(e) =>
                        handleFieldEdit("gender", e.target.value)
                      }
                    />
                    <Form.Check
                      inline
                      type="radio"
                      label="Female"
                      name="gender"
                      value="Female"
                      checked={selectedKoi?.gender === "Female"}
                      onChange={(e) =>
                        handleFieldEdit("gender", e.target.value)
                      }
                    />
                  </div>
                </Form.Group>
              </Col>
            </Row>

            {/* Diet Inputs */}
            <Form.Group controlId="formDiet">
              <Form.Label>Diet</Form.Label>
              <Form.Select
                value={selectedKoi?.diet || ""}
                onChange={(e) => handleFieldEdit("diet", e.target.value)}
              >
                <option value="Pellets">Pellets</option>
                <option value="Flakes">Flakes</option>
                <option value="Vegetables">Vegetables</option>
                <option value="Fruits">Fruits</option>
                <option value="Shrimp">Shrimp</option>
                <option value="Worms">Worms</option>
                <option value="Insects">Insects</option>
                <option value="Cheerios">Cheerios</option>
                <option value="Rice">Rice</option>
              </Form.Select>
            </Form.Group>

            {/* Image Display */}
            <Form.Group controlId="formImgDisplay">
              <Form.Label>Current Image</Form.Label>
              {selectedKoi?.imgUrl && (
                <img
                  src={selectedKoi.imgUrl}
                  alt="Koi"
                  style={{
                    width: "100%",
                    height: "auto",
                    marginBottom: "10px",
                  }}
                />
              )}
            </Form.Group>

            {/* Image Upload */}
            <Form.Group controlId="formImg">
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
              !selectedKoi?.name ||
              !selectedKoi?.origin ||
              !selectedKoi?.gender ||
              !selectedKoi?.variety ||
              selectedKoi?.size < 0 ||
              selectedKoi?.price < 0
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
