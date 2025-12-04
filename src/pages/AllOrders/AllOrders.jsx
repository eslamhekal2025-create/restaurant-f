import axios from 'axios';
import React, { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import './allOrders.css';

export default function AllOrders() {
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const getAllOrders = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/getOrders`, {
        headers: { token }
      });

      if (data.success) {
        const filtered = data.data.filter(order => order.userId);
        setAllOrders(filtered);
      }
    } catch (error) {
      toast.error("فشل في تحميل الطلبات");
    } finally {
      setLoading(false);
    }
  }, [token]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/updateOrderStatus/${orderId}`,
        { status: newStatus },
        {
          headers: { token }
        }
      );

      if (data.success) {
        toast.success("تم تحديث الحالة");
        setAllOrders(prev =>
          prev.map(order =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
      }
    } catch (error) {
      toast.error("فشل في تحديث الحالة");
    }
  };

  const deleteOrder = async (id) => {
    const result = await Swal.fire({
      title: 'هل أنت متأكد؟',
      text: "لن يمكنك التراجع بعد الحذف.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'نعم، احذف!',
      cancelButtonText: 'إلغاء',
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.delete(`${process.env.REACT_APP_API_URL}/deleteorder/${id}`, {
          headers: { token }
        });

        if (response.data.success) {
          toast.success("تم حذف الطلب بنجاح");
          getAllOrders();
        } else {
          toast.error(response.data.message || "حدث خطأ أثناء الحذف");
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "حدث خطأ غير متوقع");
      }
    }
  };

  useEffect(() => {
    getAllOrders();
  }, [getAllOrders]);

  if (loading) return <div className="loading-orders">⏳ جاري تحميل الطلبات...</div>;

  if (allOrders.length === 0) {
    return <div className="no-orders">There are no requests currently. 🚫 </div>;
  }

  return (
    <div className="AllOrders">
      {allOrders.map((order, i) => (
        <div className="order" key={order._id}>
          <button className="DeleteOrder" onClick={() => deleteOrder(order._id)}>×</button>

          <h2>#{i + 1}</h2>
          <p><strong>Name:</strong> {order.userId.name}</p>
          <p><strong>Email:</strong> {order.userId.email}</p>
          <p><strong>Mob:</strong> 0{order.userId.phone}</p>
          <p><strong>Total:</strong> {order.totalPrice} EGP</p>
          <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>

          <div>
            <strong>Status:</strong>{" "}
            <select
              value={order.status}
              onChange={(e) => handleStatusChange(order._id, e.target.value)}
            >
              <option value="pending">pending</option>
              <option value="paid">
paid              </option>
              <option value="canceled">canceled</option>
            </select>
          </div>

          <div className="product-list">
            <h4>Products:</h4>
            {order.products.map((prod, index) => {
              const currentPrice = prod.productId?.sizes?.find(s => s.size === prod.size)?.price;

              return (
                <div className="product" key={index}>
                  <p>🍕 <strong>{prod.productId?.name || 'غير معروف'}</strong></p>
                  <p>Size: {prod.size}</p>
                  <p>Price : {currentPrice ? `${currentPrice} EGP` : 'غير متاح'}</p>
                  <p>Qty: {prod.quantity}</p>
                </div>
              );
            })}
          </div>

          <hr />
        </div>
      ))}
    </div>
  );
}
