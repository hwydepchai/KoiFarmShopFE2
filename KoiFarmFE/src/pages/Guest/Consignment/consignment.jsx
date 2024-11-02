import React, { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "../../../components/feedback/Pagination";

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
      // Extract the $values array from the response
      setConsignments(response.data.$values || []);
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
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-5">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded m-4">
        {error}
      </div>
    );
  }

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = consignments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(consignments.length / itemsPerPage);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Consignment List</h1>

      {/* List */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-left font-semibold">Details</th>
              <th className="py-3 px-4 text-left font-semibold">Time Period</th>
              <th className="py-3 px-4 text-left font-semibold">Price</th>
              <th className="py-3 px-4 text-left font-semibold">Info</th>
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
                      style={{ width: "48px", height: "48px" }}
                      className="rounded-full object-cover"
                    />
                    <div>
                      <div className="text-sm font-medium">
                        ID: {consignment.id}
                      </div>
                      <div className="text-xs text-gray-600">
                        Koi ID: {consignment.koiId}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="text-sm">
                    <div>Start: {formatDate(consignment.startTime)}</div>
                    <div>End: {formatDate(consignment.endTime)}</div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="text-sm font-medium text-gray-900">
                    {formatPrice(consignment.price)}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="text-sm">
                    <div>Account ID: {consignment.accountId}</div>
                    <div>Payment ID: {consignment.paymentId}</div>
                    <div>Created: {formatDate(consignment.createdDate)}</div>
                  </div>
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
