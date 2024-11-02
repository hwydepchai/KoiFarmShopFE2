// src/pages/Guest/Consignment/consignment.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "../../../components/feedback/Pagination";
import ConsignmentForm from "../../../components/consignment/createconsignment";

const ConsignmentList = () => {
  const [consignments, setConsignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const fetchConsignments = async () => {
    try {
      const response = await axios.get(
        "https://localhost:7229/api/Consignments"
      );
      setConsignments(response.data);
      setLoading(false);
    } catch (error) {
      setError("Error fetching consignments data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsignments();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center p-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger m-4">{error}</div>;
  }

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = consignments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(consignments.length / itemsPerPage);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Consignment List</h1>

      {/* Create Form */}
      <div className="mb-6">
        <ConsignmentForm onSubmitSuccess={fetchConsignments} />
      </div>

      {/* List */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-left font-semibold">
                Photo Details
              </th>
              <th className="py-3 px-4 text-left font-semibold">Time Period</th>
              <th className="py-3 px-4 text-left font-semibold">Contact</th>
              <th className="py-3 px-4 text-left font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((consignment) => (
              <tr
                key={consignment.id}
                className="border-t border-gray-200 hover:bg-gray-50"
              >
                <td className="py-4 px-5">
                  <div className="flex items-center gap-4">
                    <img
                      src="/koiim.gif"
                      alt="Koi"
                      style={{ width: "36px", height: "36px" }}
                      className="rounded-full object-cover"
                    />
                    <div>
                      <div className="text-xs text-gray-600">
                        Koi ID: {consignment.koiId}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div>Start: {formatDate(consignment.startTime)}</div>
                  <div>End: {formatDate(consignment.endTime)}</div>
                </td>
                <td className="py-4 px-4">
                  <div>Created: {formatDate(consignment.createdDate)}</div>
                </td>
                <td className="py-4 px-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium
                    ${
                      consignment.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : consignment.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {consignment.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default ConsignmentList;
