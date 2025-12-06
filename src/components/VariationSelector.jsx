import React, { useState, useEffect } from "react";
import "./VariationSelector.css";

/**
 * VariationSelector Component
 * Allows users to select color and size variations for a product
 *
 * @param {Array} variations - Array of product variations
 * @param {Function} onVariationChange - Callback when variation is selected
 * @param {Number} basePrice - Base price of product (used if variation has no price)
 */
const VariationSelector = ({ variations, onVariationChange, basePrice }) => {
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedVariation, setSelectedVariation] = useState(null);

  // Get unique colors and sizes from variations
  const uniqueColors = [
    ...new Set(
      variations.filter((v) => v.isActive && v.color).map((v) => v.color)
    ),
  ];
  const uniqueSizes = [
    ...new Set(
      variations.filter((v) => v.isActive && v.size).map((v) => v.size)
    ),
  ];

  // Get available sizes for selected color
  const getAvailableSizes = () => {
    if (!selectedColor) {
      return uniqueSizes;
    }
    return [
      ...new Set(
        variations
          .filter((v) => v.isActive && v.color === selectedColor && v.size)
          .map((v) => v.size)
      ),
    ];
  };

  // Get available colors for selected size
  const getAvailableColors = () => {
    if (!selectedSize) {
      return uniqueColors;
    }
    return [
      ...new Set(
        variations
          .filter((v) => v.isActive && v.size === selectedSize && v.color)
          .map((v) => v.color)
      ),
    ];
  };

  // Find matching variation
  useEffect(() => {
    if (selectedColor || selectedSize) {
      const match = variations.find((v) => {
        const colorMatch = !selectedColor || v.color === selectedColor;
        const sizeMatch = !selectedSize || v.size === selectedSize;
        return v.isActive && colorMatch && sizeMatch;
      });

      if (match) {
        setSelectedVariation(match);
        onVariationChange(match);
      } else {
        setSelectedVariation(null);
        onVariationChange(null);
      }
    } else {
      setSelectedVariation(null);
      onVariationChange(null);
    }
  }, [selectedColor, selectedSize, variations, onVariationChange]);

  // Get color hex code for display
  const getColorHex = (colorName) => {
    const variation = variations.find((v) => v.color === colorName);
    return variation?.colorHex || "#cccccc";
  };

  // Check if size is available for selected color
  const isSizeAvailable = (size) => {
    if (!selectedColor) return true;
    return variations.some(
      (v) =>
        v.isActive &&
        v.color === selectedColor &&
        v.size === size &&
        v.stock > 0
    );
  };

  // Check if color is available for selected size
  const isColorAvailable = (color) => {
    if (!selectedSize) return true;
    return variations.some(
      (v) =>
        v.isActive &&
        v.size === selectedSize &&
        v.color === color &&
        v.stock > 0
    );
  };

  // Get stock for specific variation
  const getStock = () => {
    if (selectedVariation) {
      return selectedVariation.stock;
    }
    return null;
  };

  // Get price for selected variation
  const getPrice = () => {
    if (selectedVariation && selectedVariation.price) {
      return selectedVariation.price;
    }
    return basePrice;
  };

  return (
    <div className="variation-selector">
      {/* Color Selection */}
      {uniqueColors.length > 0 && (
        <div className="variation-group">
          <label className="variation-label">
            Color:{" "}
            {selectedColor && (
              <span className="selected-value">{selectedColor}</span>
            )}
          </label>
          <div className="color-options">
            {getAvailableColors().map((color) => (
              <button
                key={color}
                className={`color-option ${
                  selectedColor === color ? "active" : ""
                } ${!isColorAvailable(color) ? "disabled" : ""}`}
                onClick={() => setSelectedColor(color)}
                disabled={!isColorAvailable(color)}
                title={color}
              >
                <span
                  className="color-swatch"
                  style={{ backgroundColor: getColorHex(color) }}
                />
                <span className="color-name">{color}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Size Selection */}
      {uniqueSizes.length > 0 && (
        <div className="variation-group">
          <label className="variation-label">
            Size:{" "}
            {selectedSize && (
              <span className="selected-value">{selectedSize}</span>
            )}
          </label>
          <div className="size-options">
            {getAvailableSizes().map((size) => (
              <button
                key={size}
                className={`size-option ${
                  selectedSize === size ? "active" : ""
                } ${!isSizeAvailable(size) ? "disabled" : ""}`}
                onClick={() => setSelectedSize(size)}
                disabled={!isSizeAvailable(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Selected Variation Info */}
      {selectedVariation && (
        <div className="variation-info">
          <div className="info-item">
            <span className="info-label">Price:</span>
            <span className="info-value price">
              £{getPrice().toFixed(2).replace(/\$/, "£")}
            </span>
          </div>
          <div className="info-item">
            <span className="info-label">Stock:</span>
            <span className={`info-value stock ${getStock() < 5 ? "low" : ""}`}>
              {getStock() > 0 ? `${getStock()} available` : "Out of stock"}
            </span>
          </div>
        </div>
      )}

      {/* Warning if no variation selected */}
      {(uniqueColors.length > 0 || uniqueSizes.length > 0) &&
        !selectedVariation && (
          <div className="variation-warning">
            Please select {uniqueColors.length > 0 && "a color"}
            {uniqueColors.length > 0 && uniqueSizes.length > 0 && " and "}
            {uniqueSizes.length > 0 && "a size"}
          </div>
        )}
    </div>
  );
};

export default VariationSelector;
