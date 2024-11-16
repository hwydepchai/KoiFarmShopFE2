/* eslint-disable no-unused-vars */
import React from "react";
import PropTypes from "prop-types"; // Import PropTypes
import { Navigate } from "react-router-dom";

// ProtectedRoute component
const ProtectedRoute = ({ element: Element, ...rest }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  // Kiểm tra quyền truy cập của user
  if (!user || (user.roleId !== 1 && user.roleId !== 2)) {
    return <Navigate to="/" replace />;
  }

  return <Element {...rest} />;
};

ProtectedRoute.propTypes = {
  element: PropTypes.elementType.isRequired, // Đảm bảo element là một React component
};

export default ProtectedRoute;
