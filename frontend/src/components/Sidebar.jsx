// src/components/Sidebar.jsx
import React from "react";
import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="w-1/5 bg-gradient-to-b from-blue-100 to-white p-6 shadow-lg min-h-screen">
      {/* اسم المحل */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-blue-800">Memo Shop</h2>
        <p className="text-sm text-gray-500 mt-1">نظام إدارة المقهى</p>
      </div>

      {/* الروابط */}
      <ul className="space-y-4">
        <li>
          <Link
            to="/dashboard/orders"
            className="block bg-white hover:bg-blue-50 border border-blue-200 rounded-xl px-4 py-2 text-blue-700 font-medium transition"
          >
            🧾 الطلبات
          </Link>
        </li>
        <li>
          <Link
            to="/dashboard/products"
            className="block bg-white hover:bg-blue-50 border border-blue-200 rounded-xl px-4 py-2 text-blue-700 font-medium transition"
          >
            📦 المنتجات
          </Link>
        </li>
        <li>
          <Link
            to="/dashboard/categories"
            className="block bg-white hover:bg-blue-50 border border-blue-200 rounded-xl px-4 py-2 text-blue-700 font-medium transition"
          >
            🗂️ الفئات
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
