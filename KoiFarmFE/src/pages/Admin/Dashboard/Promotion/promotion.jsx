import React, { useState, useEffect } from "react";
import PromotionForm from "./PromotionForm";
import PromotionTable from "./PromotionTable";

const PromotionManagement = () => {
  const [promotions, setPromotions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [formData, setFormData] = useState({
    point: "",
    discountPercentage: "",
    status: "active",
    expirationDate: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Format date cho form input
  const formatDateForInput = (date) => {
    if (!date) return "";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "";
    return d.toISOString().split("T")[0];
  };

  // Format date cho hiển thị
  const formatDateForDisplay = (date) => {
    if (!date) return "-";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "-";
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(d);
  };

  // Kiểm tra trạng thái hết hạn
  const checkExpired = (expirationDate) => {
    if (!expirationDate) return false;
    try {
      const expDate = new Date(expirationDate);
      return expDate < new Date();
    } catch {
      return false;
    }
  };

  // Fetch promotions
  const fetchPromotions = async () => {
    try {
      const response = await fetch("https://localhost:7229/api/Promotion");
      const data = await response.json();
      setPromotions(data.$values);
    } catch (error) {
      console.error("Error fetching promotions:", error);
    }
  };

  // Fetch accounts
  const fetchAccounts = async () => {
    try {
      const response = await fetch("https://localhost:7229/api/Accounts");
      const data = await response.json();
      setAccounts(data.$values);
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };

  useEffect(() => {
    fetchPromotions();
    fetchAccounts();
  }, []);

  const resetForm = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({
      point: "",
      discountPercentage: "",
      status: "active",
      expirationDate: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Format date trước khi gửi lên server
      const formattedData = {
        ...formData,
        expirationDate: formData.expirationDate
          ? new Date(formData.expirationDate).toISOString()
          : null,
      };

      const url = isEditing
        ? `https://localhost:7229/api/Promotion/${editingId}`
        : "https://localhost:7229/api/Promotion";

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      if (response.ok) {
        fetchPromotions();
        resetForm();
      }
    } catch (error) {
      console.error("Error submitting promotion:", error);
    }
  };

  const handleEdit = (promotion) => {
    setIsEditing(true);
    setEditingId(promotion.id);
    setFormData({
      point: promotion.point,
      discountPercentage: promotion.discountPercentage,
      status: promotion.status,
      expirationDate: formatDateForInput(promotion.expirationDate),
    });
  };

  const handleDelete = async (promotionId) => {
    if (window.confirm("Are you sure you want to delete this promotion?")) {
      try {
        const response = await fetch(
          `https://localhost:7229/api/Promotion/${promotionId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          // Xóa promotion khỏi state để UI cập nhật ngay lập tức
          setPromotions(promotions.filter((p) => p.id !== promotionId));
          // Fetch lại data để đảm bảo đồng bộ với server
          fetchPromotions();
        } else {
          alert("Failed to delete promotion. Please try again.");
        }
      } catch (error) {
        console.error("Error deleting promotion:", error);
        alert("Error occurred while deleting. Please try again.");
      }
    }
  };

  const getEligibleAccounts = (promotion) => {
    return accounts.filter((account) => account.point >= promotion.point);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <PromotionForm
          formData={formData}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
          isEditing={isEditing}
          resetForm={resetForm}
        />

        <PromotionTable
          promotions={promotions}
          formatDateForDisplay={formatDateForDisplay}
          checkExpired={checkExpired}
          getEligibleAccounts={getEligibleAccounts}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default PromotionManagement;
