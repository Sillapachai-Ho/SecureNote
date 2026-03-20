import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  // ตรวจสอบว่ามี Token และ User ID ในเครื่องหรือไม่
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  // ถ้าไม่มีอย่างใดอย่างหนึ่ง ถือว่าไม่มี Session
  if (!token || !userId) {
    // เตะกลับไปหน้า Sign In ทันที
    return <Navigate to="/sign-in" replace />;
  }

  // ถ้ามี Session ก็ปล่อยให้เข้าหน้า Home ได้ตามปกติ
  return children;
}

export default ProtectedRoute;