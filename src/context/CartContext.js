import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [countCart, setcountCart] = useState(0);
  const [wishList, setwishList] = useState([]);
  const [countWishList, setcountWishList] = useState(0);
  const [users, setUsers] = useState([]);
  const [countUsers, setcountUsers] = useState(0);
  const [Loading, setLoading] = useState(null);

  const addToCart = async (productId, quantity, size) => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/AddToCart`,
        {productId,quantity,size},
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      if (data.success) {
        getCart();
      }
      return data;
    } catch (err) {
      console.error("🧨 Failed to add to cart:", err.response?.data || err.message);
      throw err;
    }
  };

  const getCart = async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/getCart`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });

      if (data.success) {
        setCart(data.data || []);
        setcountCart(data.count);
      }
    } catch (err) {
      console.error("Error fetching cart:", err.response?.data?.message || err.message);
    }
  };

  const removeCart = async (product) => {
    try {
      const { data } = await axios.delete(`${process.env.REACT_APP_API_URL}/deleteProductCart/${product}`, {
        headers: { token: localStorage.getItem("token") },
      });
      if (data.success) {
        getCart();
      }
    } catch (err) {
      console.error("Error removing from cart:", err.response?.data?.message || err.message);
    }
  };

  const addToWihsList = async (productId) => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/addToWishlist`,
        { productId },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      if (data.success) {
        getWishList();
        console.log("productIdWishList", productId);
      }
    } catch (err) {
      console.error("Error adding to wishlist:", err.response?.data?.message || err.message);
      toast.error("Failed to add item to wishlist");
    }
  };

  const removeWishList = async (product) => {
    try {
      const { data } = await axios.delete(
        `${process.env.REACT_APP_API_URL}/removeWishList/${product}`,
        {
          headers: { token: localStorage.getItem("token") },
        }
      );
      if (data.success) {
        getWishList();
      }
    } catch (error) {
      console.error("Error removing product from wishlist:", error);
    }
  };

  const getWishList = async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/WishList`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });

      if (data.success) {
        setwishList(data.data || []);
        setcountWishList(data.count);
      }
    } catch (err) {
      console.error("Error fetching wishlist:", err.response?.data?.message || err.message);
    }
  };

  const getAllUser = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/getUsers`);
      if (data.success) {
        setUsers(data.data);
        setcountUsers(data.count);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCart();
    getWishList();
    getAllUser();
  }, []);

  return (
    <CartContext.Provider
      value={{
        Loading,
        getCart,
        cart,
        addToCart,
        countCart,
        removeCart,
        addToWihsList,
        wishList,
        countWishList,
        removeWishList,
        users,
        countUsers,
        getAllUser,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
