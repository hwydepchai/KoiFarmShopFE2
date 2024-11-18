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
  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.category1 : "Unknown";
  };
  const filteredKoiList = koiList.filter((koi) => {
    const lowerCaseSearch = searchTerm.toLowerCase();

    return (
      koi.id.toString().includes(lowerCaseSearch) || // Search in ID
      koi.name.toString().includes(lowerCaseSearch) || // Search in Name
      getCategoryName(koi.categoryId).toLowerCase().includes(lowerCaseSearch) || // Search in Category Name
      (koi.origin && koi.origin.toLowerCase().includes(lowerCaseSearch)) || // Search in Origin
      koi.quantity.toString().includes(lowerCaseSearch) || // Search in Quantity
      koi.price.toString().includes(lowerCaseSearch) || // Search in Price
      koi.status.toLowerCase().includes(lowerCaseSearch) // Search in Status
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
      {activeKoi.length > 0 ? (
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th scope="col" onClick={() => sortKoiList("id")}>
                ID
                {sortConfig.key === "id" &&
                  (sortConfig.direction === "asc" ? " ↑" : " ↓")}
              </th>
              <th scope="col" onClick={() => sortKoiList("name")}>
                Name
                {sortConfig.key === "name" &&
                  (sortConfig.direction === "asc" ? " ↑" : " ↓")}
              </th>
              <th scope="col" onClick={() => sortKoiList("categoryId")}>
                Category
                {sortConfig.key === "categoryId" &&
                  (sortConfig.direction === "asc" ? " ↑" : " ↓")}
              </th>
              <th scope="col" onClick={() => sortKoiList("origin")}>
                Origin
                {sortConfig.key === "origin" &&
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
                <td>{koi.name}</td>
                <td>{getCategoryName(koi.categoryId)}</td>
                <td>{koi.origin}</td>
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
      ) : (
        <p className="text-center">No available fishes</p>
      )}

      {deletedKoi.length > 0 && (
        <>
          <h3 className="text-center my-4">Deleted Koi Fish</h3>
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Name</th>
                <th scope="col">Category</th>
                <th scope="col">Origin</th>
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
                  <td>{koi.name}</td>
                  <td>{getCategoryName(koi.categoryId)}</td>
                  <td>{koi.origin}</td>
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
        </>
      )}

      {/* Modal for editing Koi details */}
      {selectedKoi && (
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Koi Fishy Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <div className="row">
                <div className="col-md-6">
                  <Form.Group controlId="formName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={selectedKoi.name || ""}
                      onChange={(e) => handleFieldEdit("name", e.target.value)}
                    />
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group controlId="formGender">
                    <Form.Label>Gender</Form.Label>
                    <div className="d-flex">
                      <Form.Check
                        type="radio"
                        label="Male"
                        name="gender"
                        value="Male"
                        checked={selectedKoi.gender === "Male"}
                        onChange={(e) =>
                          handleFieldEdit("gender", e.target.value)
                        }
                        className="me-3"
                      />
                      <Form.Check
                        type="radio"
                        label="Female"
                        name="gender"
                        value="Female"
                        checked={selectedKoi.gender === "Female"}
                        onChange={(e) =>
                          handleFieldEdit("gender", e.target.value)
                        }
                      />
                    </div>
                  </Form.Group>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <Form.Group controlId="formVariety">
                    <Form.Label>Variety</Form.Label>
                    <Form.Select
                      value={selectedKoi.variety || ""}
                      onChange={(e) =>
                        handleFieldEdit("variety", e.target.value)
                      }
                    >
                      <option value="">Select Variety</option>
                      <option value="Kohaku">Kohaku</option>
                      <option value="Showa Sanke">Showa Sanke</option>
                      <option value="Utsuri">Utsuri</option>
                      <option value="Asagi">Asagi</option>
                      <option value="Shusui">Shusui</option>
                      <option value="Ginrin">Ginrin</option>
                      <option value="Ogon">Ogon</option>
                      <option value="Tancho">Tancho</option>
                    </Form.Select>
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group controlId="formSize">
                    <Form.Label>Size</Form.Label>
                    <Form.Control
                      type="number"
                      value={selectedKoi.size || ""}
                      onChange={(e) => handleFieldEdit("size", e.target.value)}
                    />
                  </Form.Group>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <Form.Group controlId="formOrigin">
                    <Form.Label>Origin</Form.Label>
                    <Form.Select
                      value={selectedKoi.origin || ""}
                      onChange={(e) =>
                        handleFieldEdit("origin", e.target.value)
                      }
                    >
                      <option value="">Select Origin</option>
                      <option value="Vietnam">Vietnam</option>
                      <option value="Japan">Japan</option>
                      <option value="Thailand">Thailand</option>
                      <option value="China">China</option>
                      <option value="South Korea">South Korea</option>
                      <option value="India">India</option>
                    </Form.Select>
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group controlId="formYearOfBirth">
                    <Form.Label>Year of Birth</Form.Label>
                    <Form.Control
                      type="number"
                      value={selectedKoi.yearOfBirth || ""}
                      onChange={(e) =>
                        handleFieldEdit("yearOfBirth", e.target.value)
                      }
                    />
                  </Form.Group>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <Form.Group controlId="formCharacter">
                    <Form.Label>Character</Form.Label>
                    <Form.Select
                      value={selectedKoi.character || ""}
                      onChange={(e) =>
                        handleFieldEdit("character", e.target.value)
                      }
                    >
                      <option value="">Select Character</option>
                      <option value="Calm">Calm</option>
                      <option value="Aggressive">Aggressive</option>
                      <option value="Playful">Playful</option>
                      <option value="Shy">Shy</option>
                      <option value="Curious">Curious</option>
                    </Form.Select>
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group controlId="formPrice">
                    <Form.Label>Price</Form.Label>
                    <Form.Control
                      type="number"
                      value={selectedKoi.price || ""}
                      onChange={(e) => handleFieldEdit("price", e.target.value)}
                    />
                  </Form.Group>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <Form.Group controlId="formDiet">
                    <Form.Label>Diet</Form.Label>
                    <Form.Control
                      type="text"
                      value={selectedKoi.diet || ""}
                      onChange={(e) => handleFieldEdit("diet", e.target.value)}
                    />
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group controlId="formQuantity">
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control
                      type="number"
                      value={selectedKoi.quantity || ""}
                      onChange={(e) =>
                        handleFieldEdit("quantity", e.target.value)
                      }
                    />
                  </Form.Group>
                </div>
              </div>

              <div className="row">
                <div className="col-md-12">
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
                </div>
              </div>
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
