import React, { useState, useRef, useCallback, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useProduct } from "../../context/productContext";
import "./AddItem.css";

const AddItem = React.memo(() => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "pizza",
    sizes: { s: "", m: "", l: "" },
  });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const fileInputRef = useRef(null);
  const { getAllProducts } = useProduct();

  // Clean up blob URLs
  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

    const handleChange = useCallback((e) => {
      const { name, value } = e.target;

      if (["s", "m", "l"].includes(name)) {
        setFormData((prev) => ({
          ...prev,
          sizes: { ...prev.sizes, [name]: value },
        }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    }, []);

  const handleImageChange = useCallback((e) => {
    const files = Array.from(e.target.files);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...files]);
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  }, []);

  const handleRemoveImage = useCallback((index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const sizesArray = Object.entries(formData.sizes)
      .filter(([_, price]) => price)
      .map(([size, price]) => ({ size, price: Number(price) }));

    if (sizesArray.length === 0) {
      toast.warning("يرجى إدخال سعر واحد على الأقل!");
      return;
    }

    const dataAdd = new FormData();
     dataAdd.append("name", formData.name);
     dataAdd.append("description", formData.description);
     dataAdd.append("category", formData.category);
     dataAdd.append("sizes", JSON.stringify(sizesArray));
     images.forEach((img) => dataAdd.append("images", img));

    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/addProduct`,
        dataAdd,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (data.success) {
        toast.success("تمت إضافة الطبق بنجاح!");
        setFormData({ name: "", description: "", category: "pizza", sizes: { s: "", m: "", l: "" } });
        setImages([]);
        setImagePreviews([]);
        getAllProducts();
      } else {
        toast.warning("حدث خطأ أثناء الإضافة.");
      }
    } catch (err) {
      console.error(err);
      toast.error("حدث خطأ أثناء الإرسال.");
    }
  };

  return (
    <div className="add-item-container">
      <h2>إضافة طبق جديد</h2>
      <form className="add-item-form" onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="meal name" value={formData.name} onChange={handleChange} required />
        <textarea name="description" placeholder="ingredients / description" value={formData.description} onChange={handleChange} />

        <div className="size-inputs">
          {["s", "m", "l"].map((size) => (
            <input
              key={size}
              type="number"
              name={size}
              placeholder={`سعر الحجم ${size.toUpperCase()}`}
              value={formData.sizes[size]}
              onChange={handleChange}
            />
          ))}
        </div>

        <select name="category" value={formData.category} onChange={handleChange}>
          <option value="pizza">Pizza</option>
          <option value="mixPizza">Mix Pizza</option>
          <option value="burger">Burger</option>
          <option value="pasta">Pasta</option>
        </select>

        <button type="button" className="upload-btn" onClick={() => fileInputRef.current.click()}>
          📸 رفع الصور
        </button>

        <input
          type="file"
          accept="image/*"
          multiple
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleImageChange}
        />

        <div className="image-preview-container">
          {imagePreviews.map((src, index) => (
            <div key={index} className="image-preview">
              <img src={src} alt={`صورة ${index + 1}`} />
              <button type="button" onClick={() => handleRemoveImage(index)}>x</button>
            </div>
          ))}
        </div>

        <button type="submit" className="submit-btn">إضافة الطبق</button>
      </form>
    </div>
  );
});

export default AddItem;
