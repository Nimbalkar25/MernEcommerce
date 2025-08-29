import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = ({  isAdmin = false }) => {
  const { loading, isAuthenticated, user } = useSelector((state) => state.user);
  const location = useLocation();

  if (loading ) return null;

    if (!user || (isAdmin && !user.role)) return null;

  if (isAuthenticated === false) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (isAdmin && user.role !== "admin") {
    return <Navigate to="/account" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
