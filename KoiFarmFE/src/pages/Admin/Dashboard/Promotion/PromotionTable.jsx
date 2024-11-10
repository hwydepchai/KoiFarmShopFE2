import React from "react";
import { Pencil, Trash2 } from "lucide-react";

const PromotionTable = ({
  promotions,
  formatDateForDisplay,
  checkExpired,
  getEligibleAccounts,
  handleEdit,
  handleDelete,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold">Promotions List</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                No.
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Points Required
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Discount %
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Expiration Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Eligible Users
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {promotions.map((promotion, index) => (
              <tr key={promotion.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {promotion.point}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {promotion.discountPercentage}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      checkExpired(promotion.expirationDate)
                        ? "bg-red-100 text-red-800"
                        : promotion.status.toLowerCase() === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {checkExpired(promotion.expirationDate)
                      ? "Expired"
                      : promotion.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {formatDateForDisplay(promotion.createdDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {formatDateForDisplay(promotion.expirationDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getEligibleAccounts(promotion).length} users
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(promotion)}
                      className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                      title="Edit promotion"
                    >
                      <Pencil className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(promotion.id)}
                      className="p-1 hover:bg-red-100 rounded-md transition-colors"
                      title="Delete promotion"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PromotionTable;
