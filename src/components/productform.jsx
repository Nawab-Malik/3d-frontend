// components/ProductForm.js
import React, { useState, useEffect } from "react";
import axios from "axios";

function ProductForm({ product, onClose, onSave }) {
  const [title, setTitle] = useState("");
  const [categories, setCategories] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasVariations, setHasVariations] = useState(false);
  const [variations, setVariations] = useState([]);

  useEffect(() => {
    if (product) {
      setTitle(product.title);
      setCategories(product.categories.join(", "));
      setDescription(product.description);
      setPrice(product.price);
      setOriginalPrice(product.originalPrice);
      setImagePreview(product.imageUrl);
      setHasVariations(product.hasVariations || false);
      setVariations(product.variations || []);
    }
  }, [product]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if file is an image
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      // Check file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        alert("Image size must be less than 10MB");
        return;
      }

      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addVariation = () => {
    setVariations([
      ...variations,
      {
        color: "",
        colorHex: "#000000",
        size: "",
        price: "",
        stock: 0,
        isActive: true,
      },
    ]);
  };

  const removeVariation = (index) => {
    setVariations(variations.filter((_, i) => i !== index));
  };

  const updateVariation = (index, field, value) => {
    const newVariations = [...variations];
    newVariations[index][field] = value;
    setVariations(newVariations);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("categories", categories);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("originalPrice", originalPrice || price);
    formData.append("hasVariations", hasVariations);
    if (hasVariations && variations.length > 0) {
      formData.append("variations", JSON.stringify(variations));
    }

    if (image) {
      formData.append("image", image);
    }

    try {
      // Add authentication header
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer admin123",
        },
      };

      if (product) {
        // Update existing product
        await axios.put(
          `https://3-d-backend-3pgu.vercel.app/api/admin/products/${product._id}`,
          formData,
          config
        );
      } else {
        // Create new product
        await axios.post(
          "https://3-d-backend-3pgu.vercel.app/api/admin/products",
          formData,
          config
        );
      }

      onSave();
      onClose();
    } catch (error) {
      console.error("Error saving product:", error);
      if (error.response) {
        alert(
          `Error: ${error.response.data.error || error.response.data.message}`
        );
      } else {
        alert("Error saving product. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
          width: "90%",
          maxWidth: "500px",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <h3>{product ? "Edit Product" : "Add New Product"}</h3>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "15px" }}>
            <label>Title: *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ width: "100%", padding: "8px" }}
              required
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label>Categories (comma separated):</label>
            <input
              type="text"
              value={categories}
              onChange={(e) => setCategories(e.target.value)}
              style={{ width: "100%", padding: "8px" }}
              placeholder="e.g., Home Decor, Gadgets, Art"
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label>Description:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ width: "100%", padding: "8px", minHeight: "80px" }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label>Price: *</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              style={{ width: "100%", padding: "8px" }}
              min="0"
              step="0.01"
              required
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label>Original Price (if on sale):</label>
            <input
              type="number"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
              style={{ width: "100%", padding: "8px" }}
              min="0"
              step="0.01"
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label>Image: {!product && "(optional)"}</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ width: "100%", padding: "8px" }}
            />
            {imagePreview && (
              <div style={{ marginTop: "10px" }}>
                <img
                  src={
                    imagePreview.startsWith("data:") ||
                    imagePreview.startsWith("http")
                      ? imagePreview
                      : `https://3-d-backend-3pgu.vercel.app${imagePreview}`
                  }
                  alt="Preview"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                />
                <p style={{ fontSize: "12px", marginTop: "5px" }}>
                  Image Preview
                </p>
              </div>
            )}
          </div>

          {/* Product Variations */}
          <div
            style={{
              marginBottom: "15px",
              borderTop: "2px solid #eee",
              paddingTop: "15px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <input
                type="checkbox"
                checked={hasVariations}
                onChange={(e) => {
                  setHasVariations(e.target.checked);
                  if (!e.target.checked) setVariations([]);
                }}
                style={{ marginRight: "8px" }}
              />
              <label style={{ margin: 0, fontWeight: "bold" }}>
                This product has variations (Color/Size)
              </label>
            </div>

            {hasVariations && (
              <div style={{ marginTop: "15px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <h4 style={{ margin: 0 }}>Product Variations</h4>
                  <button
                    type="button"
                    onClick={addVariation}
                    style={{
                      padding: "6px 12px",
                      background: "#28a745",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "14px",
                    }}
                  >
                    + Add Variation
                  </button>
                </div>

                {variations.length === 0 ? (
                  <p style={{ color: "#666", fontSize: "14px" }}>
                    No variations added. Click "Add Variation" to create one.
                  </p>
                ) : (
                  variations.map((variation, index) => (
                    <div
                      key={index}
                      style={{
                        border: "1px solid #ddd",
                        padding: "12px",
                        marginBottom: "10px",
                        borderRadius: "6px",
                        backgroundColor: "#f9f9f9",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "10px",
                        }}
                      >
                        <strong style={{ fontSize: "14px" }}>
                          Variation #{index + 1}
                        </strong>
                        <button
                          type="button"
                          onClick={() => removeVariation(index)}
                          style={{
                            padding: "4px 8px",
                            background: "#dc3545",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "12px",
                          }}
                        >
                          Remove
                        </button>
                      </div>

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "10px",
                        }}
                      >
                        <div>
                          <label
                            style={{
                              fontSize: "13px",
                              display: "block",
                              marginBottom: "4px",
                            }}
                          >
                            Color Name
                          </label>
                          <input
                            type="text"
                            value={variation.color}
                            onChange={(e) =>
                              updateVariation(index, "color", e.target.value)
                            }
                            placeholder="e.g., Red, Blue"
                            style={{
                              width: "100%",
                              padding: "6px",
                              fontSize: "13px",
                            }}
                          />
                        </div>

                        <div>
                          <label
                            style={{
                              fontSize: "13px",
                              display: "block",
                              marginBottom: "4px",
                            }}
                          >
                            Color Hex
                          </label>
                          <input
                            type="color"
                            value={variation.colorHex}
                            onChange={(e) =>
                              updateVariation(index, "colorHex", e.target.value)
                            }
                            style={{
                              width: "100%",
                              padding: "2px",
                              height: "32px",
                            }}
                          />
                        </div>

                        <div>
                          <label
                            style={{
                              fontSize: "13px",
                              display: "block",
                              marginBottom: "4px",
                            }}
                          >
                            Size
                          </label>
                          <input
                            type="text"
                            value={variation.size}
                            onChange={(e) =>
                              updateVariation(index, "size", e.target.value)
                            }
                            placeholder="e.g., S, M, L, XL"
                            style={{
                              width: "100%",
                              padding: "6px",
                              fontSize: "13px",
                            }}
                          />
                        </div>

                        <div>
                          <label
                            style={{
                              fontSize: "13px",
                              display: "block",
                              marginBottom: "4px",
                            }}
                          >
                            Price (optional)
                          </label>
                          <input
                            type="number"
                            value={variation.price}
                            onChange={(e) =>
                              updateVariation(index, "price", e.target.value)
                            }
                            placeholder="Leave empty for base price"
                            min="0"
                            step="0.01"
                            style={{
                              width: "100%",
                              padding: "6px",
                              fontSize: "13px",
                            }}
                          />
                        </div>

                        <div>
                          <label
                            style={{
                              fontSize: "13px",
                              display: "block",
                              marginBottom: "4px",
                            }}
                          >
                            Stock Quantity
                          </label>
                          <input
                            type="number"
                            value={variation.stock}
                            onChange={(e) =>
                              updateVariation(
                                index,
                                "stock",
                                parseInt(e.target.value) || 0
                              )
                            }
                            min="0"
                            style={{
                              width: "100%",
                              padding: "6px",
                              fontSize: "13px",
                            }}
                          />
                        </div>

                        <div style={{ display: "flex", alignItems: "center" }}>
                          <input
                            type="checkbox"
                            checked={variation.isActive}
                            onChange={(e) =>
                              updateVariation(
                                index,
                                "isActive",
                                e.target.checked
                              )
                            }
                            style={{ marginRight: "6px" }}
                          />
                          <label style={{ margin: 0, fontSize: "13px" }}>
                            Active
                          </label>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              style={{
                padding: "10px 15px",
                background: "#ccc",
                color: "black",
                border: "none",
                borderRadius: "4px",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                opacity: isSubmitting ? 0.6 : 1,
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: "10px 15px",
                background: "#514F6E",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                opacity: isSubmitting ? 0.6 : 1,
              }}
            >
              {isSubmitting
                ? "Saving..."
                : (product ? "Update" : "Add") + " Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductForm;
