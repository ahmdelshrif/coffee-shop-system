import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import CategoryProducts from "./pages/CategoryProducts";

function App() {
  return (
    <Router>
      <Routes>

        {/* صفحة تسجيل الدخول */}
        <Route path="/" element={<Login />} />

        {/* لوحة التحكم */}
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="orders" element={<Orders />} />
          <Route path="products" element={<Products />} />
          <Route path="categories" element={<Categories />} />
          {/* ممكن تعمل Route افتراضي جوه الـ dashboard لو حبيت */}
        </Route>

        {/* ✅ صفحة منتجات فئة معينة، مستقلة خارج الداشبورد */}
        <Route path="/category/:categoryId/products" element={<CategoryProducts />} />

      </Routes>
    </Router>
  );
}

export default App;