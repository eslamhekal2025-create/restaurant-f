import React from 'react';
import axios from 'axios';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

export default function CartComponent() {
  const { cart, removeCart, getCart } = useCart();
  const navigate = useNavigate();
  const items = Array.isArray(cart) ? cart : [];

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      const { data } = await axios.put(`${process.env.REACT_APP_API_URL}/updateQuntatiy`, {
        productId,
        quantity: newQuantity,
      }, {
        headers: { token: localStorage.getItem("token") }
      });
      if (data.success) getCart();
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const increaseQuantity = (item) => updateQuantity(item._id, (item.quantity || 1) + 1);
  const decreaseQuantity = (item) => updateQuantity(item._id, (item.quantity || 1) - 1);
  const removeFromCart = (itemId) => removeCart(itemId);

  const totalPrice = items.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 1), 0);

  return (
    <div className="cart-container">
      <h2 className="cart-title">🛒 Shopping Cart</h2>

      {items.length === 0 ? (
        <p className="empty-cart">Your cart is empty.</p>
      ) : (
        <>
          <div className="cart-items">
            {items.map((item, index) => (
              <div className="cart-item" key={index}>
                <div className="cart-item-image-container">
                  <img
                    src={`${process.env.REACT_APP_API_URL}${item.images[0]}`}
                    alt={item.name}
                    className="cart-item-image"
                    loading="lazy"
                  />
                </div>
                <div className="cart-item-details">
                  <h3 className="item-name">{item.name}</h3>
                  <span className="item-size text-capitalize">({item.size})</span>
                  <p className="item-price">Price: ${item.price?.toFixed(2)}</p>
                  <div className="quantity-controls">
                    <button onClick={() => decreaseQuantity(item)} disabled={item.quantity <= 1}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => increaseQuantity(item)}>+</button>
                  </div>
                  <p className="item-total">Total: ${(item.price * item.quantity).toFixed(2)}</p>
                  <button className="remove-btn" onClick={() => removeFromCart(item._id)}>
                    Remove ❌
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-total">
            <h3>Total: ${totalPrice.toFixed(2)}</h3>
            <button className="checkout-btn" onClick={() => navigate("/checkout")}>
              ✅ Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
