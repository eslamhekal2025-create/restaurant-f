import React, { useEffect, useMemo } from "react";
import { useCart } from "../../context/CartContext";
import { useProduct } from "../../context/productContext";
import ProductCard from "./ProductCart";
import "./allProducts.css";

export default function AllProducts() {
  const {
    products,
    categories,
    activeCategory,
    setActiveCategory,
    getAllProducts,
    TotalPages,
    CurrentPage,
    setCurrentPage,
  } 
  =useProduct();

  useEffect(() => {
    getAllProducts(CurrentPage);
  }, [CurrentPage]);

  const filteredProducts = useMemo(() => {
    return activeCategory === "all"
      ? products
      : products.filter((p) => p.category === activeCategory);
  }, [products, activeCategory]);

  return (
    <div className="all-products-page">
      <div className="category-tabs">
        <button
          className={`category-tab ${activeCategory === "all" ? "active" : ""}`}
          onClick={() => setActiveCategory("all")}
        >
          All
        </button>
        {categories.map((cat, index) => (
          <button
            key={index}
            className={`category-tab ${activeCategory === cat ? "active" : ""}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="products-container">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))
        ) : (
          <p className="no-products">No products available.</p>
        )}
      </div>

      {TotalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={CurrentPage === 1}
          >
            Previous
          </button>
          <span>Page {CurrentPage} of {TotalPages}</span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, TotalPages))}
            disabled={CurrentPage === TotalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
