import React, { useEffect, useState } from "react";
import "./invoice.css" // استايل الطباعة

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem("order")) || [];
    setOrders(savedOrders);
  }, []);

  const totalPrice = orders.reduce((total, item) => total + (item.price * item.quantity), 0);

  const handlePrint = () => {
    window.print();
    localStorage.removeItem("order");
    setOrders([]);
  };

  return (
    <div className="invoice-container p-4 max-w-4xl mx-auto">
      <h2 className="invoice-title text-2xl font-bold mb-6">فاتورة طلب</h2>

      {orders.length === 0 ? (
        <p className="no-orders">لا توجد طلبات حالياً</p>
      ) : (
        <>
          <table className="invoice-table w-full border">
            <thead>
              <tr className="bg-gray-200">
                <th>التاريخ</th>
                <th>اسم المنتج</th>
                <th>الكمية</th>
                <th>السعر</th>
                <th>الإجمالي</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((item) => (
                <tr key={item._id}>
                  <td>{item.date}</td>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>{item.price} جنيه</td>
                  <td>{item.price * item.quantity} جنيه</td>
                </tr>
              ))}
              <tr className="bg-gray-100 font-bold">
                <td colSpan="4" className="text-center">الإجمالي الكلي</td>
                <td>{totalPrice} جنيه</td>
              </tr>
            </tbody>
          </table>

          <div className="print-button-container mt-4">
            <button
              onClick={handlePrint}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              طباعة الفاتورة
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Orders;
