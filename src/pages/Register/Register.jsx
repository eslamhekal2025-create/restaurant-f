import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import './register.css';
import { useUser as useUserContext } from "../../context/userContext.js";

const Register = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const { setRefresh } = useUserContext();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setUser((prev) => ({ ...prev, image: file }));
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setUser((prev) => ({ ...prev, image: null }));
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(user).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });
      
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data?.success) {
        localStorage.setItem("phone", user.phone);
        setRefresh((prev) => !prev);
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Register</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={user.name}
          onChange={handleChange}
          required
          className="auth-input"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={user.email}
          onChange={handleChange}
          required
          className="auth-input"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={user.password}
          onChange={handleChange}
          required
          className="auth-input"
        />
        <input
          type="number"
          name="phone"
          placeholder="Phone"
          value={user.phone}
          onChange={handleChange}
          required
          className="auth-input"
        />
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleImageChange}
          className="auth-input"
        />
        {preview && (
          <div className="img-preview-wrapper">
            <button
              type="button"
              onClick={handleRemoveImage}
              className="btnRemoveImg"
            >
              ×
            </button>
            <img src={preview} alt="Preview" className="ImgPrevReg" />
          </div>
        )}
        <button className="auth-button" type="submit">Register</button>
      </form>
      <p className="auth-text">
        Already have an account?{" "}
        <Link className="auth-link" to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Register;
