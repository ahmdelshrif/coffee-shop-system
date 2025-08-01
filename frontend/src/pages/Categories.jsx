import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    image: null, // أضف هذا السطر
  });
  const [editingCategoryId, setEditingCategoryId] = useState(null);
const [editData, setEditData] = useState({ name: "", description: "" });
const [page, setPage] = useState(1);
const [totalResults, setTotalResults] = useState(0);
const navigate = useNavigate();

  
  const [userRole, setUserRole] = useState("");

  const fetchCategories = async (currentPage = 1) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:9000/api/v2/category?page=${currentPage}&limit=6`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
  
      setCategories(res.data.Data || []);
      setTotalResults(res.data.total || 0);  // استقبلها من الباك
      setPage(currentPage);
    } catch (err) {
      console.error("فشل تحميل الفئات", err);
    }
  };
  
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserRole(decoded.role || decoded.data?.role || "");
      } catch (err) {
        console.error("Invalid token:", err);
      }
    }
  
    fetchCategories(1);
  }, []);
  
  
  

  const handleUpdateCategory = async (id, updatedData) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:9000/api/v2/category/${id}`,
        updatedData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // تحديث الواجهة بعد التعديل
      fetchCategories();
      setEditingCategoryId(null);
    } catch (err) {
      console.error("فشل التعديل", err);
    }
  };
  

  const handleAddCategory = async () => {
    const { name, description, image } = newCategory;
  
    if (!name || !description || !image) {
      alert("يرجى إدخال اسم ووصف الفئة واختيار صورة");
      return;
    }
  
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("image", image);
  
    try {
      await axios.post(
        "http://localhost:9000/api/v2/category",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      setNewCategory({ name: "", description: "", image: null });
      setShowForm(false);
      fetchCategories();
    } catch (err) {
      console.error("فشل إضافة الفئة", err);
      if (err.response?.data?.message) {
        alert("❌ " + err.response.data.message);
      } else {
        alert("حدث خطأ أثناء الإضافة");
      }
    }
  };
    
    const handleDelete = async (id) => {
      const confirmed = window.confirm("هل تريد حذف هذه الفئة؟");
    if (!confirmed) return;

    try {
      await axios.delete(`http://localhost:9000/api/v2/category/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchCategories();
    } catch (err) {
      console.error("فشل الحذف", err);
      alert("❌ لم يتم الحذف");
    }
  };
  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">📁 الفئات</h2>
  
      {(userRole === "manager" || userRole === "admin") && (
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-600 text-white px-3 py-1 rounded text-sm mb-4"
        >
          ➕ إضافة فئة جديدة
        </button>
      )}
  
      {showForm && (
        <div className="bg-gray-100 p-4 rounded mb-6">
          <input
            type="text"
            placeholder="اسم الفئة"
            value={newCategory.name}
            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
            className="border px-2 py-1 rounded w-full mb-2"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setNewCategory({ ...newCategory, image: e.target.files[0] })}
            className="border px-2 py-1 rounded w-full mb-2"
          />
          <input
            type="text"
            placeholder="الوصف"
            value={newCategory.description}
            onChange={(e) =>
              setNewCategory({ ...newCategory, description: e.target.value })
            }
            className="border px-2 py-1 rounded w-full mb-2"
          />
          <button
            onClick={handleAddCategory}
            className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
          >
            حفظ الفئة
          </button>
        </div>
      )}
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
  {categories.map((cat) => (
    <div
      key={cat._id}
      className="bg-white border rounded shadow p-4 flex flex-col justify-between"
    >
    <img
  onClick={() => navigate(`/category/${cat._id}/products`)}
  src={`http://localhost:9000/uploads/categoryes/${cat.image}`}
  alt={cat.name}
  className="w-full h-40 object-cover mb-3 rounded cursor-pointer"
/>
      <h3 className="text-lg font-semibold">{cat.name}</h3>
      <p className="text-sm text-gray-600">{cat.description}</p>

      {(userRole === "manager" || userRole === "admin") && (
        <>
          <button
            onClick={() => {
              setEditingCategoryId(cat._id);
              setEditData({ name: cat.name, description: cat.description });
            }}
            className="mt-3 bg-blue-500 text-white text-sm px-3 py-1 rounded hover:bg-blue-600"
          >
            ✏️ تعديل الفئة
          </button>

          {editingCategoryId === cat._id && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdateCategory(cat._id, editData);
              }}
              className="mt-2"
            >
              <input
                type="text"
                placeholder="اسم الفئة"
                value={editData.name}
                onChange={(e) =>
                  setEditData({ ...editData, name: e.target.value })
                }
                className="block w-full mb-2 p-2 border rounded"
              />
              <textarea
                placeholder="الوصف"
                value={editData.description}
                onChange={(e) =>
                  setEditData({ ...editData, description: e.target.value })
                }
                className="block w-full mb-2 p-2 border rounded"
              />
              <button
                type="submit"
                className="bg-green-500 text-white text-sm px-3 py-1 rounded hover:bg-green-600"
              >
                حفظ التعديل
              </button>
              <button
                type="button"
                onClick={() => setEditingCategoryId(null)}
                className="ml-2 bg-gray-400 text-white text-sm px-3 py-1 rounded hover:bg-gray-500"
              >
                إلغاء
              </button>
            </form>
          )}

          <button
            onClick={() => {
              const confirmDelete = window.confirm(
                "هل أنت متأكد من حذف الفئة؟ سيتم حذف جميع المنتجات المرتبطة بها!"
              );
              if (confirmDelete) {
                handleDelete(cat._id);
              }
            }}
            className="mt-3 bg-red-500 text-white text-sm px-3 py-1 rounded hover:bg-red-600"
          >
            🗑 حذف الفئة
          </button>
        </>
      )}
    </div>
  ))}
</div>

{/* ✅ الزرارين بعد الـ grid وتحت كل الكروت */}
<div className="w-full flex justify-center items-center mt-6 space-x-2 rtl:space-x-reverse">
  <button
    onClick={() => fetchCategories(page - 1)}
    disabled={page === 1}
    className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
  >
    السابق
  </button>
  <span className="text-sm font-medium">صفحة {page}</span>
  <button
    onClick={() => fetchCategories(page + 1)}
    disabled={page * 6 >= totalResults}
    className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
  >
    التالي
  </button>
</div>
      </div>
    
  );
  
};

export default Categories;
