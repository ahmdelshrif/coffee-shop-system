import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import axiosInstance from "../utils/axios";
import { jwtDecode } from "jwt-decode";
import { ThreeDot } from "react-loading-indicators";
import Swal from "sweetalert2";
import { FaTrash, FaCartPlus } from "react-icons/fa";
const Products = () => {
  const [categories, setCategories] = useState([]);
  const [productsByCategory, setProductsByCategory] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showFormByCategory, setShowFormByCategory] = useState({});
  const [newProductByCategory, setNewProductByCategory] = useState({});
  const [userRole, setUserRole] = useState("");
  const [quantities, setQuantities] = useState({});
  const [currentPageByCategory, setCurrentPageByCategory] = useState({});
    const [totalPagesByCategory, setTotalPagesByCategory] = useState({});
  const limitPerPage = 4; // عدد المنتجات في كل صفحة


const fetchCategoryProducts = useCallback(
  async (categoryId, categoryName, page = 1) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:9000/api/v2/products?categoryName=${encodeURIComponent(
          categoryName
        )}&page=${page}&limit=${limitPerPage}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data && Array.isArray(res.data.Data)) {
        // 👈 جلب العدد الكلي من API أو من طول البيانات
        const totalItems =
          res.data.total ||
          res.data.totalCount ||
          res.data.count ||
          0;

        // 👈 حفظ المنتجات في الـ state
        setProductsByCategory((prev) => ({
          ...prev,
          [categoryId]: res.data.Data,
        }));

        // 👈 حساب إجمالي الصفحات
        setTotalPagesByCategory((prev) => ({
          ...prev,
          [categoryId]: Math.ceil(totalItems / limitPerPage),
        }));

        // 👈 تحديث الصفحة الحالية
        setCurrentPageByCategory((prev) => ({
          ...prev,
          [categoryId]: page,
        }));

      
      }
    } catch (err) {
      console.error("فشل تحميل المنتجات:", err);
      setError("فشل تحميل المنتجات");
    }
  },
  []
);

const changePage = (categoryId, categoryName, newPage) => {
  if (
    newPage >= 1 &&
    newPage <= totalPagesByCategory[categoryId] &&
    newPage !== currentPageByCategory[categoryId]
  ) {
    fetchCategoryProducts(categoryId, categoryName, newPage);
  }
};

  const fetchCategoriesAndProducts = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("لم يتم تسجيل الدخول");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const res = await axios.get("http://localhost:9000/api/v2/category", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const cats = (res.data.Data || []).map((cat) => ({
        id: cat._id,
        name: cat.name,
      }));
      setCategories(cats);

      await Promise.all(
        cats.map((cat) => fetchCategoryProducts(cat.id, cat.name))
      );
    } catch (err) {
      console.error("فشل تحميل الفئات:", err);
      setError("فشل تحميل الفئات");
    } finally {
      setLoading(false);
    }
  }, [fetchCategoryProducts]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserRole(decoded.role || decoded.data?.role || "");
      } catch (err) {
        console.error("Invalid token:", err);
        setUserRole("");
      }
    }
    fetchCategoriesAndProducts();
  }, [fetchCategoriesAndProducts]);

  const toggleForm = (categoryId) => {
    setShowFormByCategory((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const handleAddProduct = async (product, categoryId) => {
    if (!product?.name || !product?.price || !categoryId) {
      Swal.fire("تحذير", "يجب إدخال اسم المنتج، السعر، والفئة", "warning");
      return;
    }

    if (!(product.image instanceof File)) {
      Swal.fire("تحذير", "الرجاء اختيار صورة صحيحة", "warning");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("price", product.price);
      formData.append("category", categoryId);
      formData.append("image", product.image);

      const token = localStorage.getItem("token");
      await axiosInstance.post(`/products`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      await fetchCategoryProducts(
        categoryId,
        categories.find((c) => c.id === categoryId).name
      );

      setShowFormByCategory((prev) => ({ ...prev, [categoryId]: false }));
      setNewProductByCategory((prev) => ({ ...prev, [categoryId]: {} }));

Swal.fire({
  toast: true,
  position: "top-end", // فوق على اليمين
  icon: "success",
  title: " تمت إضافة المنتج بنجاح",
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true
});
    } catch (err) {
      console.error("Error adding product:", err.response?.data || err.message);
      Swal.fire(
        "خطأ",
        err.response?.data?.message || "❌ حدث خطأ أثناء الإضافة",
        "error"
      );
    }
  };

  const deleteProduct = async (id, categoryId) => {
const confirmed = await Swal.fire({
  title: "هل أنت متأكد؟",
  text: "لن يمكنك التراجع عن هذا الحذف",
  icon: "warning",
  showCancelButton: true,
  buttonsStyling: false, // عطل التنسيق الافتراضي
  confirmButtonText: "نعم، احذف",
  cancelButtonText: "إلغاء",
  customClass: {
    confirmButton: "swal2-confirm-btn",
    cancelButton: "swal2-cancel-btn"
  }
});


    if (!confirmed.isConfirmed) return;

    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:9000/api/v2/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchCategoryProducts(
        categoryId,
        categories.find((c) => c.id === categoryId).name
      );
    } catch (err) {
      console.error("تفاصيل الخطأ:", err.response?.data);
      Swal.fire("خطأ", "❌ فشل حذف المنتج", "error");
    }
  };

  const addToOrder = (product, qty) => {
    let currentOrder = JSON.parse(localStorage.getItem("order")) || [];
    const existingItemIndex = currentOrder.findIndex(
      (item) => item._id === product._id
    );

    const qtyNum = Math.max(1, qty);

    if (existingItemIndex !== -1) {
      currentOrder[existingItemIndex].quantity += qtyNum;
    } else {
      currentOrder.push({
        ...product,
        quantity: qtyNum,
        date: new Date().toLocaleString(),
      });
    }

    localStorage.setItem("order", JSON.stringify(currentOrder));

    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "✅ تم إضافة المنتج للفاتورة",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
  };

 
  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">📦 المنتجات حسب الفئة</h2>

      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <ThreeDot variant="pulsate" color="#32cd32" size="medium" />
        </div>
      ) : error ? (
        <p className="text-red-500 mt-4">{error}</p>
      ) : (
        categories.map(({ id, name }) => {
          const allProducts = productsByCategory[id] || [];
          const currentPage = currentPageByCategory[id] || 1;
          const totalPages = Math.ceil(allProducts.length / limitPerPage);
          const startIndex = (currentPage - 1) * limitPerPage;
       const productsToShow = allProducts;


          return (
            <div key={id} className="mb-10">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-semibold border-b border-gray-300 pb-1">
                  {name}
                </h3>
                {(userRole === "manager" || userRole === "admin") && (
                  <button
                    onClick={() => toggleForm(id)}
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                  >
                    ➕ إضافة منتج
                  </button>
                )}
              </div>

              {showFormByCategory[id] &&
                (userRole === "manager" || userRole === "admin") && (
                  <div className="bg-gray-100 p-4 rounded mb-4">
                    <input
                      type="text"
                      placeholder="اسم المنتج"
                      value={newProductByCategory[id]?.name || ""}
                      onChange={(e) =>
                        setNewProductByCategory((prev) => ({
                          ...prev,
                          [id]: { ...prev[id], name: e.target.value },
                        }))
                      }
                      className="border px-2 py-1 rounded w-full mb-2"
                    />
                    <input
                      type="number"
                      placeholder="السعر"
                      value={newProductByCategory[id]?.price || ""}
                      onChange={(e) =>
                        setNewProductByCategory((prev) => ({
                          ...prev,
                          [id]: { ...prev[id], price: e.target.value },
                        }))
                      }
                      className="border px-2 py-1 rounded w-full mb-2"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setNewProductByCategory((prev) => ({
                          ...prev,
                          [id]: { ...prev[id], image: e.target.files[0] },
                        }))
                      }
                      className="border px-2 py-1 rounded w-full mb-2"
                    />
                    <button
                      onClick={() =>
                        handleAddProduct(newProductByCategory[id], id)
                      }
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                    >
                      حفظ المنتج
                    </button>
                  </div>
                )}

              {/* عرض المنتجات */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {productsToShow.map((product) => (
                  <div
                    key={product._id}
                    className="p-4 border rounded bg-white shadow text-sm"
                  >
                    {product.image && (
                      <img
                        src={`http://localhost:9000/uploads/products/${product.image}`}
                        alt={product.name}
                        className="w-full h-28 object-cover mb-2 rounded"
                      />
                    )}
                    <h4 className="font-bold text-base mb-1">{product.name}</h4>
                    <p>💰 السعر: {product.price} جنيه</p>
                    {product.description && (
                      <p className="text-xs text-gray-600 mt-1">
                        📝 {product.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between gap-2 mt-2">
                      <div className="flex gap-2">
                        {(userRole === "manager" || userRole === "admin") && (
                          <button
                            onClick={() =>
                              deleteProduct(product._id, id)
                            }
                            className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                          >
                            <FaTrash />
                          </button>
                        )}
                        <button
                          onClick={() =>
                            addToOrder(product, quantities[product._id] || 1)
                          }
                          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                        >
                          <FaCartPlus />
                        </button>
                      </div>

                      <input
                        type="number"
                        min="1"
                        value={quantities[product._id] || 1}
                        onChange={(e) => {
                          const value = parseInt(e.target.value) || 1;
                          setQuantities((prev) => ({
                            ...prev,
                            [product._id]: value,
                          }));
                        }}
                        className="border px-2 py-1 rounded text-center w-[80px]"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
      {(totalPagesByCategory[id] || 0) > 1 && (
  <div className="flex justify-center mt-4 gap-2">
    {/* السابق */}
    <button
      onClick={() => changePage(id, name, currentPageByCategory[id] - 1)}
      disabled={currentPageByCategory[id] === 1}
      className="px-3 py-1 border rounded disabled:opacity-50"
    >
      ◀
    </button>

    {/* الأرقام */}
    {Array.from({ length: totalPagesByCategory[id] || 1 }, (_, i) => (
      <button
        key={i + 1}
        onClick={() => changePage(id, name, i + 1)}
        className={`px-3 py-1 border rounded ${
          currentPageByCategory[id] === i + 1
            ? "bg-blue-500 text-white"
            : "bg-white"
        }`}
      >
        {i + 1}
      </button>
    ))}

    {/* التالي */}
    <button
      onClick={() =>
        changePage(id, name, currentPageByCategory[id] + 1)
      }
      disabled={
        currentPageByCategory[id] === totalPagesByCategory[id]
      }
      className="px-3 py-1 border rounded disabled:opacity-50"
    >
      ▶
    </button>
  </div>
)}


            </div>
          );
        })
      )}
    </div>
  );
};

export default Products;
