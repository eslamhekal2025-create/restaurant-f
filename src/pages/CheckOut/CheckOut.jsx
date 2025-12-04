import React, { useRef, useState } from 'react';
import { useCart } from '../../context/CartContext.js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './checkOut.css';

export default function CheckoutPage() {
  const { cart, getCart } = useCart();
  const navigate = useNavigate();
  const invoiceRef = useRef();

  const [redirectedToReview, setRedirectedToReview] = useState(false);

  const items = Array.isArray(cart) ? cart : [];
  const totalPrice = items.reduce(
    (acc, item) => acc + (item.price || 0) * (item.quantity || 1),
    0
  );
  console.log("cart",cart)

  const handleConfirmOrder = async () => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/checkOut`,
        {}, 
        { headers: { token: localStorage.getItem("token") } }
      );

      if (data.success) {
        toast.success(
          <div>
            Order placed successfully ✅
            <br />
            <button
              onClick={() => {
                setRedirectedToReview(true);  
                navigate('/AddReview');
                toast.dismiss();
              }}
              className='RateRestaurant'
            >
              ⭐ Rate the Restaurant
            </button>
          </div>,
          { autoClose: false }
        );
        getCart();
        navigate(`/`);
      } else {
        toast.error(data.message || "Checkout failed");
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      
    }
  };

  return (
    <div className="checkout-container">
      <div ref={invoiceRef} id="invoice-section">
        <h2>Checkout Page 🧾</h2>

        {items.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <div className="checkout-items">
              {items.map((item, index) => (
                <div key={index} className="checkout-item">
<div className="checkout-item">
  <span className='text-capitalize'><strong>{item.name}</strong> ({item.size})</span>
  <span>{item.quantity} × ${item.price?.toFixed(2)}</span>
</div>
                </div>
              ))}
            </div>

            <h3>Total: ${totalPrice.toFixed(2)}</h3>
          </>
        )}
      </div>

      {items.length > 0 && (
        <button className="confirm-order-btn" onClick={handleConfirmOrder}>
          ✅ Confirm Order
        </button>
      )}
    </div>
  );
}
