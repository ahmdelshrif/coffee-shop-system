import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const categoryOrder = ["مشروبات الساخنه", "مشروبات بارده", "الماكولات"];

const Products = () => {
  const [productsByCategory, setProductsByCategory] = useState({});
  const [currentPageByCategory, setCurrentPageByCategory] = useState({});
  const [totalPagesByCategory, setTotalPagesByCategory] = useState({});
  const [error, setError] = useState("");
  const [showFormByCategory, setShowFormByCategory] = useState({});
  const [newProductByCategory, setNewProductByCategory] = useState({});
  const navigate = useNavigate();

  const limitPerPage = 4;

  const fetchCategoryProducts = async (categoryName, page = 1) => {
    try {
      const res = await axios.get(
        `http://localhost:9000/api/v2/products?page=${page}&limit=${limitPerPage}&categoryName=${categoryName}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data && Array.isArray(res.data.Date)) {
        setProductsByCategory((prev) => ({ ...prev, [categoryName]: res.data.Date }));
        setTotalPagesByCategory((prev) => ({ ...prev, [categoryName]: res.data.totalPages }));
        setCurrentPageByCategory((prev) => ({ ...prev, [categoryName]: page }));
      }
    } catch (err) {
      setError("فشل تحميل المنتجات");
    }
  };

  useEffect(() => {
    categoryOrder.forEach((category) => {
      fetchCategoryProducts(category);
    });
  }, []);

  const toggleForm = (categoryName) => {
    setShowFormByCategory((prev) => ({
      ...prev,
      [categoryName]: !prev[categoryName],
    }));
  };

  const handleAddProduct = async (categoryName) => {
    const product = newProductByCategory[categoryName];
    if (!product?.name || !product?.price) {
      alert("يرجى إدخال اسم وسعر المنتج");
      return;
    }
  
    try {
      await axios.post(
        "http://localhost:9000/api/v2/products",
        {
          name: product.name,
          price: product.price,
          category: categoryName,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
  
      fetchCategoryProducts(categoryName, currentPageByCategory[categoryName] || 1);
      setShowFormByCategory((prev) => ({ ...prev, [categoryName]: false }));
      setNewProductByCategory((prev) => ({ ...prev, [categoryName]: {} }));
    }  catch (err) {
      console.error("تفاصيل الخطأ:", err.response);
    
      if (err.response?.data?.message) {
        alert("❌ " + err.response.data.message); // الرسالة من backend
      } else {
        alert("حدث خطأ أثناء الإضافة");
      }
    }
  };


  const handleNextPage = (category) => {
    const currentPage = currentPageByCategory[category] || 1;
    const totalPages = totalPagesByCategory[category] || 1;
    if (currentPage < totalPages) {
      fetchCategoryProducts(category, currentPage + 1);
    }
  };

  const handlePrevPage = (category) => {
    const currentPage = currentPageByCategory[category] || 1;
    if (currentPage > 1) {
      fetchCategoryProducts(category, currentPage - 1);
    }
  };

  const deleteProduct = async (id, category) => {
    const confirmed = window.confirm("هل أنت متأكد أنك تريد حذف هذا المنتج؟");
    if (!confirmed) return;

    try {
      await axios.delete(`http://localhost:9000/api/v2/products/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchCategoryProducts(category, currentPageByCategory[category]);
    }  catch (err) {
      console.error("تفاصيل الخطأ:", err.response?.data); // ✅ مهم جدا للمراقبة
    
      if (err.response?.status === 403) {
        alert("⛔ " + err.response.data.message);  // ✅ ده اللي هيعرض "ليس لديك صلاحية"
      } else {
        alert("❌ فشل حذف المنتج");
      }
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">📦 المنتجات حسب الفئة</h2>

      {categoryOrder.map((categoryName) => (
        <div key={categoryName} className="mb-10">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl font-semibold border-b border-gray-300 pb-1">
              {categoryName}
            </h3>
            <button
              onClick={() => toggleForm(categoryName)}
              className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
            >
              ➕ إضافة منتج
            </button>
          </div>

          {showFormByCategory[categoryName] && (
            <div className="bg-gray-100 p-4 rounded mb-4">
              <input
                type="text"
                placeholder="اسم المنتج"
                value={newProductByCategory[categoryName]?.name || ""}
                onChange={(e) =>
                  setNewProductByCategory((prev) => ({
                    ...prev,
                    [categoryName]: {
                      ...prev[categoryName],
                      name: e.target.value,
                    },
                  }))
                }
                className="border px-2 py-1 rounded w-full mb-2"
              />
              <input
                type="number"
                placeholder="السعر"
                value={newProductByCategory[categoryName]?.price || ""}
                onChange={(e) =>
                  setNewProductByCategory((prev) => ({
                    ...prev,
                    [categoryName]: {
                      ...prev[categoryName],
                      price: e.target.value,
                    },
                  }))
                }
                className="border px-2 py-1 rounded w-full mb-2"
              />
              <button
                onClick={() => handleAddProduct(categoryName)}
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
              >
                حفظ المنتج
              </button>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {(productsByCategory[categoryName] || []).map((product) => (
              <div
                key={product._id}
                className="p-4 border rounded bg-white shadow text-sm"
              >
                <h4 className="font-bold text-base mb-1">{product.name}</h4>
                <p>💰 السعر: {product.price} جنيه</p>
                {product.description && (
                  <p className="text-xs text-gray-600 mt-1">📝 {product.description}</p>
                )}
                <button
                  onClick={() => deleteProduct(product._id, categoryName)}
                  className="mt-2 bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                >
                  حذف
                </button>
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-center items-center gap-4">
            <button
              onClick={() => handlePrevPage(categoryName)}
              disabled={(currentPageByCategory[categoryName] || 1) === 1}
              className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
            >
              ⬅
            </button>
            <span className="font-bold text-sm">
              صفحة {currentPageByCategory[categoryName] || 1} من{" "}
              {totalPagesByCategory[categoryName] || 1}
            </span>
            <button
              onClick={() => handleNextPage(categoryName)}
              disabled={
                (currentPageByCategory[categoryName] || 1) ===
                totalPagesByCategory[categoryName]
              }
              className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
            >
              ➡
            </button>
          </div>
        </div>
      ))}

      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default Products;
