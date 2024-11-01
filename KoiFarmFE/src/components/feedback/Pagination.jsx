import React from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="d-flex justify-content-center align-items-center gap-2 mt-4">
      <button
        className="btn btn-outline-primary"
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        style={{
          minWidth: "40px",
          height: "40px",
          borderRadius: "4px",
        }}
      >
        <IoIosArrowBack />
      </button>

      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={`btn ${
            number === currentPage ? "btn-primary" : "btn-outline-primary"
          }`}
          style={{
            minWidth: "40px",
            height: "40px",
            borderRadius: "4px",
          }}
        >
          {number}
        </button>
      ))}

      <button
        className="btn btn-outline-primary"
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        style={{
          minWidth: "40px",
          height: "40px",
          borderRadius: "4px",
        }}
      >
        <IoIosArrowForward />
      </button>
    </div>
  );
};

export default Pagination;
