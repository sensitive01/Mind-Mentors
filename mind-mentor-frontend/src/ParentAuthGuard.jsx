// src/components/ParentAuthGuard.jsx
import { useEffect, useState } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ParentAuthGuard = ({ children }) => {
  const location = useLocation();
  const parentId = localStorage.getItem("parentId");

  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (!parentId) {
      toast.warning("Please login to continue.");
      const timer = setTimeout(() => {
        setRedirect(true);
      }, 2500); 

      return () => clearTimeout(timer);
    }
  }, [parentId]);

  if (!parentId) {
    if (redirect) {
      return <Navigate to="/parent/login" state={{ from: location }} replace />;
    }
    return <ToastContainer position="top-center" autoClose={1500} />;
  }

  return (
    <>
      {children}
      <ToastContainer position="top-center" autoClose={1500} />
    </>
  );
};

export default ParentAuthGuard;
