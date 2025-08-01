// src/pages/CategoryProducts.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const CategoryProducts = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `http://localhost:9000/api/v2/category/by-category/${categoryId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
  
        setProducts(res.data.Data || []);
      } catch (err) {
        console.error("فشل تحميل المنتجات", err);
        alert("❌ لا يوجد منتجات لهذه الفئة");
      }
    };
  
    fetchProducts();
  }, [categoryId]);
  

  return (
<div className="p-4 max-w-5xl mx-auto">
  <h2 className="text-xl font-bold mb-4 text-center">🛍 المنتجات الخاصة بالفئة</h2>
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
    {products.map((product) => (
      <div
        key={product._id}
        className="border rounded-lg shadow p-2 hover:shadow-md transition duration-200"
      >
        <img
          src={`http://localhost:9000/uploads/products/${product.image}`}
          alt={product.name}
          className="w-full h-28 object-cover mb-2 rounded"
        />
        <h3 className="text-sm font-semibold">{product.name}</h3>
        <p className="text-xs text-gray-600 line-clamp-2">{product.description}</p>
        <p className="text-sm text-green-600 font-bold mt-1">
          السعر: {product.price} ج.م
        </p>
      </div>
    ))}
  </div>
</div>
  );
};  

export default CategoryProducts;
