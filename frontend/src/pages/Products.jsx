import React, { useEffect, useState } from "react";
import axios from "axios";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    category: "مشروبات الساخنه",
    description: "",
  });

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(
        `http://localhost:9000/api/v2/products?page=${currentPage}&limit=${productsPerPage}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data && Array.isArray(res.data.Date)) {
        setProducts(res.data.Date);
        setTotalPages(res.data.totalPages || 1);
      } else {
        setError("البيانات غير متوقعة");
      }
    } catch (err) {
      setError("فشل تحميل المنتجات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  const deleteProduct = async (id) => {
    const confirmed = window.confirm("هل أنت متأكد أنك تريد حذف هذا المنتج؟");
  
    if (!confirmed) return;
  
    try {
      await axios.delete(`http://localhost:9000/api/v2/products/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchProducts();
    } catch (error) {
      console.error("فشل حذف المنتج:", error);
    }
  };
  

  const addProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:9000/api/v2/products", newProduct, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setShowForm(false);
      setNewProduct({
        name: "",
        price: "",
        category: "مشروبات الساخنه",
        description: "",
      });
      fetchProducts();
    } catch (error) {
      console.error("فشل إضافة المنتج:", error);
    }
  };

  const groupedProducts = products.reduce((groups, product) => {
    const categoryName =
      typeof product.category === "object"
        ? product.category.name || "بدون فئة"
        : product.category || "بدون فئة";

    if (!groups[categoryName]) {
      groups[categoryName] = [];
    }
    groups[categoryName].push(product);
    return groups;
  }, {});

  const order = ["مشروبات الساخنه", "مشروبات بارده", "الماكولات"];
  const sortedCategoryKeys = Object.keys(groupedProducts).sort((a, b) => {
    const indexA = order.indexOf(a);
    const indexB = order.indexOf(b);

    if (indexA === -1 && indexB === -1) return a.localeCompare(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  sortedCategoryKeys.forEach((cat) => {
    groupedProducts[cat].sort((a, b) => a.price - b.price);
  });

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">📦 المنتجات</h2>

      <button
        onClick={() => setShowForm(!showForm)}
        className="mb-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        {showForm ? "إغلاق النموذج" : "➕ إضافة منتج"}
      </button>

      {showForm && (
        <form
          onSubmit={addProduct}
          className="mb-6 p-4 border rounded bg-gray-50 grid gap-4"
        >
          <input
            type="text"
            placeholder="اسم المنتج"
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
            required
            className="p-2 border rounded"
          />
          <input
            type="number"
            placeholder="السعر"
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct({ ...newProduct, price: e.target.value })
            }
            required
            className="p-2 border rounded"
          />
          <select
            value={newProduct.category}
            onChange={(e) =>
              setNewProduct({ ...newProduct, category: e.target.value })
            }
            className="p-2 border rounded"
          >
            <option value="مشروبات الساخنه">☕ مشروبات ساخنه</option>
            <option value="مشروبات بارده">🧊 مشروبات بارده</option>
            <option value="الماكولات">🍽️ الماكولات</option>
          </select>
          <textarea
            placeholder="الوصف (اختياري)"
            value={newProduct.description}
            onChange={(e) =>
              setNewProduct({ ...newProduct, description: e.target.value })
            }
            className="p-2 border rounded"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            حفظ المنتج
          </button>
        </form>
      )}

      {loading && <p>جاري التحميل...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {sortedCategoryKeys.length > 0 ? (
        sortedCategoryKeys.map((categoryName) => (
          <div key={categoryName} className="mb-8">
            <h3 className="text-xl font-semibold mb-3 border-b border-gray-300 pb-1">
              {categoryName}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {groupedProducts[categoryName].map((product) => (
                <div
                  key={product._id}
                  className="p-3 border rounded shadow bg-white text-sm"
                >
                  <h4 className="text-base font-bold mb-1">{product.name}</h4>
                  <p>💰 السعر: {product.price} جنيه</p>
                  {product.description && (
                    <p className="text-xs text-gray-600 mt-1">
                      📝 {product.description}
                    </p>
                  )}
                  <button
                    onClick={() => deleteProduct(product._id)}
                    className="mt-2 bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                  >
                    حذف المنتج
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <p>لا توجد منتجات حالياً.</p>
      )}

      <div className="mt-6 flex justify-center items-center gap-4">
        <button
          onClick={goToPrevPage}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          ⬅ السابق
        </button>
        <span className="font-bold text-base">
          صفحة {currentPage} من {totalPages}
        </span>
        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          التالي ➡
        </button>
      </div>
    </div>
  );
};

export default Products;