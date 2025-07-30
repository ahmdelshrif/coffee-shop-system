// src/pages/Dashboard.jsx
import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import ProductsPage from "./Products";
import OrdersPage from "./Orders";
import CategoriesPage from "./Categories";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("products");

  const renderContent = () => {
    switch (activeTab) {
      case "products":
        return <ProductsPage />;
      case "orders":
        return <OrdersPage />;
      case "categories":
        return <CategoriesPage />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="w-4/5 p-6 bg-gray-50 flex-1">
        {/* التابات */}
        <div className="flex space-x-4 mb-4">
          <button
            className={`px-4 py-2 rounded ${
              activeTab === "products"
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => setActiveTab("products")}
          >
            المنتجات
          </button>
          <button
            className={`px-4 py-2 rounded ${
              activeTab === "orders"
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => setActiveTab("orders")}
          >
            الطلبات
          </button>
          <button
            className={`px-4 py-2 rounded ${
              activeTab === "categories"
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => setActiveTab("categories")}
          >
            الفئات
          </button>
        </div>

        {/* المحتوى حسب التاب */}
        <div>{renderContent()}</div>
      </div>
    </div>
  );
};

export default Dashboard;
