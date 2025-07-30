import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:9000/api/v2/user/login", {
        email,
        password,
      });

      const { Token, data } = response.data;

      // ✅ حفظ التوكن والمستخدم في localStorage
      localStorage.setItem("token", Token);
      localStorage.setItem("user", JSON.stringify(data));

      // ✅ توجيه المستخدم إلى الصفحة الرئيسية أو لوحة التحكم
      navigate("/dashboard");
    } catch (err) {
      console.error("خطأ أثناء تسجيل الدخول:", err);
      alert("فشل في تسجيل الدخول. تأكد من البريد وكلمة المرور.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded shadow-md w-96"
      >
        <h2 className="text-2xl mb-4 font-bold text-center">تسجيل الدخول</h2>

        <input
          type="email"
          placeholder="البريد الإلكتروني"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-3 py-2 border rounded"
          required
        />

        <input
          type="password"
          placeholder="كلمة المرور"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 px-3 py-2 border rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          دخول
        </button>
      </form>
    </div>
  );
}

export default Login;
