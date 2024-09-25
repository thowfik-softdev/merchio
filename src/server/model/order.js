const mongoose = require("mongoose");

// Define the order schema
const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true // Ensure a user is always associated with an order
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true // Ensure productId is always provided
        },
        quantity: {
          type: Number,
          required: true,
          min: 1 // Minimum quantity must be at least 1
        },
        priceAtPurchase: {
          type: Number,
          required: true // Store the price at the time of purchase for accuracy
        }
      }
    ],
    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered"],
      default: "Pending"
    },
    shippingAddress: {
      type: String,
      required: true // Ensure shipping address is provided
    },
    paymentMethod: {
      type: String,
      enum: ["Credit Card", "RazorPay", "Cash on Delivery"],
      required: true // Payment method must be specified
    },
    totalAmount: {
      type: Number,
      required: true // Total amount must be calculated and stored
    }
  },
  { timestamps: true } // Automatically add createdAt and updatedAt timestamps
);

// Pre-save middleware to calculate the total amount before saving the order
orderSchema.pre("save", async function (next) {
  // Only recalculate the totalAmount if the 'products' field has been modified
  if (!this.isModified("products")) {
    return next(); // If products haven't changed, move on to the next middleware
  }

  // Calculate the total price of the order
  this.totalAmount = this.products.reduce((accumulator, product) => {
    return accumulator + product.priceAtPurchase * product.quantity; // Calculate total
  }, 0); // Initialize accumulator to 0

  // Move to the next middleware or save operation
  next();
});

// Create the Order model using the schema
const Order = mongoose.model("Order", orderSchema);

// Export the Order model so it can be used in other parts of the application
module.exports = Order;
