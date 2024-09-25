const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ["Available", "Not-Available"],
      default: "Available"
    },
    productId: {
      type: String,
      required: true,
      unique: true
    },
    productImages: [
      {
        isMain: {
          type: Boolean,
          default: false
        },
        url: {
          type: String,
          required: true
        }
      }
    ],
    productPrice: {
      type: Number,
      required: true,
      min: 0
    },
    description: String,
    category: {
      type: String,
      required: true,
      enum: ["men", "women", "kids"]
    },
    subcategory: {
      type: String,
      required: true,
      enum: ["clothes", "watches", "shoes", "accessories"]
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    features: {
      type: [String], // Array of strings to list multiple feature points
      default: [] // Set default to an empty array
    },
    careInstructions: {
      type: [String], // Array of strings for multiple care instruction points
      default: []
    },
    shippingInfo: {
      type: [String], // Array of strings for shipping information points
      default: []
    },
    returnPolicy: {
      type: [String], // Array of strings for return policy points
      default: []
    }
  },
  { timestamps: true }
);

// Custom validation for productImages to ensure at least one image and only one isMain
productSchema.path("productImages").validate(function (images) {
  // Ensure there is at least one image
  if (!images || images.length === 0) return false; // No images means validation fails

  // Count how many images have isMain set to true
  const mainImageCount = images.filter((image) => image.isMain).length;

  // Ensure there is at most 1 image with isMain: true
  return mainImageCount <= 1; // Allow only one main image
}, "A product must have at least one image, and there can only be one main image (isMain: true).");

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
