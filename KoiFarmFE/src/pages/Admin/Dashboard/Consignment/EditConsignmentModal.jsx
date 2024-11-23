import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { UploadCloud } from "lucide-react";

const EditConsignmentModal = ({ show, handleClose, consignment, onSave }) => {
  const [editForm, setEditForm] = useState({
    name: consignment?.name || "",
    yearOfBirth: consignment?.yearOfBirth || "",
    gender: consignment?.gender || "",
    origin: consignment?.origin || "",
    variety: consignment?.variety || "",
    character: consignment?.character || "",
    size: consignment?.size || "",
    amountFood: consignment?.amountFood || "",
    price: consignment?.price || "",
    status: consignment?.status || "pending",
    img: consignment?.images?.$values || [],
  });

  const [selectedFile, setSelectedFile] = useState(null);

  // Handle file change
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // Submit form data to parent component
  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", editForm.name);
    formData.append("yearOfBirth", editForm.yearOfBirth);
    formData.append("gender", editForm.gender);
    formData.append("origin", editForm.origin);
    formData.append("variety", editForm.variety);
    formData.append("character", editForm.character);
    formData.append("size", editForm.size);
    formData.append("amountFood", editForm.amountFood);
    formData.append("price", editForm.price);
    formData.append("status", editForm.status);

    if (selectedFile) {
      formData.append("img", selectedFile);
    }

    onSave(formData);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Update Consignment</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              value={editForm.name}
              onChange={(e) =>
                setEditForm({ ...editForm, name: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Year Of Birth</Form.Label>
            <Form.Control
              type="number"
              value={editForm.yearOfBirth}
              onChange={(e) =>
                setEditForm({ ...editForm, yearOfBirth: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Gender</Form.Label>
            <Form.Control
              type="text"
              value={editForm.gender}
              onChange={(e) =>
                setEditForm({ ...editForm, gender: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Origin</Form.Label>
            <Form.Control
              type="text"
              value={editForm.origin}
              onChange={(e) =>
                setEditForm({ ...editForm, origin: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Variety</Form.Label>
            <Form.Control
              type="text"
              value={editForm.variety}
              onChange={(e) =>
                setEditForm({ ...editForm, variety: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Character</Form.Label>
            <Form.Control
              type="text"
              value={editForm.character}
              onChange={(e) =>
                setEditForm({ ...editForm, character: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Size</Form.Label>
            <Form.Control
              type="number"
              value={editForm.size}
              onChange={(e) =>
                setEditForm({ ...editForm, size: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Amount Food</Form.Label>
            <Form.Control
              type="number"
              value={editForm.amountFood}
              onChange={(e) =>
                setEditForm({ ...editForm, amountFood: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              value={editForm.price}
              onChange={(e) =>
                setEditForm({ ...editForm, price: e.target.value })
              }
            />
          </Form.Group>
          {/* <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select
              value={editForm.status}
              onChange={(e) =>
                setEditForm({ ...editForm, status: e.target.value })
              }
            >
              <option value="pending">Pending</option>
            </Form.Select>
          </Form.Group> */}
          <Form.Group className="mb-3">
            <Form.Label>Image</Form.Label>
            <div className="d-flex align-items-center">
              <Form.Control
                type="file"
                onChange={handleFileChange}
                accept="image/*"
              />
              <UploadCloud size={20} className="ms-2 text-primary" />
            </div>
            <div className="mt-2">
              {editForm.img.map((image, index) => (
                <div key={index}>
                  <a href={image.urlPath} target="_blank" rel="noreferrer">
                    {image.urlPath}
                  </a>
                </div>
              ))}
            </div>
          </Form.Group>
          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Approve
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditConsignmentModal;
