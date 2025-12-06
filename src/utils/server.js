// server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

// Verify critical environment variables on startup
const isTestMode = process.env.STRIPE_MODE !== "live";
const stripeKey = isTestMode
  ? process.env.STRIPE_TEST_SECRET_KEY
  : process.env.STRIPE_LIVE_SECRET_KEY;

if (!stripeKey) {
  console.warn(
    `⚠️ WARNING: STRIPE_${
      isTestMode ? "TEST" : "LIVE"
    }_SECRET_KEY is not configured. Payments will fail!`
  );
} else {
  console.log(`✅ Stripe configured in ${isTestMode ? "TEST" : "LIVE"} mode`);
}

const app = express();

// Middleware - CORS configuration (Allow all origins for development)
app.use(
  cors({
    origin: true, // Allow all origins
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB Connection - Use MONGO_URI from .env
const MONGODB_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ FATAL: No MongoDB connection string found in .env file!");
  console.error("💡 Please add MONGO_URI to your .env file");
  process.exit(1);
}

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    console.log("📦 Database: make3d");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    console.error("💡 Check your MONGO_URI in .env file");
    process.exit(1);
  });

// Import routes
const userRoutes = require("./routes/userroutes");
const authRoutes = require("./routes/auth");
const referralRoutes = require("./routes/referralroutes");
const couponRoutes = require("./routes/couponroutes"); // Import coupon routes
const productFeedbackRoutes = require("./routes/productfeedback");

// Routes
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Register routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/referrals", referralRoutes);
app.use("/api/products", require("./routes/productroutes"));
app.use("/api/cart", require("./routes/cartroutes"));
app.use("/api/orders", require("./routes/orderroutes"));
app.use("/api/admin", require("./routes/adminroutes"));
app.use("/api/admin/orders", require("./routes/adminorders"));
app.use("/api/test", require("./routes/test"));
app.use("/api/setup", require("./routes/tempadmin"));
app.use("/api/gallery", require("./routes/galleryroutes"));
app.use("/api/admin/gallery", require("./routes/admingallery"));
app.use("/api/contact", require("./routes/contact"));
app.use("/api/feedback", require("./routes/feedback"));
app.use("/api/coupons", couponRoutes); // Register coupon routes
app.use("/api/subscriptions", require("./routes/subscriptionroutes"));
app.use("/api/announcements", require("./routes/announcementroutes"));
app.use("/api/shipping", require("./routes/shippingroutes"));
app.use("/api/payment", require("./routes/paymentroutes"));
app.use("/api/tracking", require("./routes/trackingroutes"));
app.use("/api/product-feedback", productFeedbackRoutes); // Register product feedback routes

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Create a default product image if it doesn't exist
const defaultProductImage = path.join(uploadsDir, "default-product.png");
if (!fs.existsSync(defaultProductImage)) {
  // You could create a simple placeholder image here if needed
  console.log("Note: Default product image doesn't exist yet");
}

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Server is running",
    timestamp: new Date().toISOString(),
    mongodb:
      mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
  });
});

// Home route
app.get("/", (req, res) => {
  res.json({
    message: "3D Prints API Server",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      users: "/api/users",
      auth: "/api/auth",
      referrals: "/api/referrals",
      products: "/api/products",
      orders: "/api/orders",
    },
  });
});

// 404 handler
app.use((req, res) => {
  console.log("❌ Route not found:", req.method, req.originalUrl);
  res.status(404).json({
    message: "Route not found",
    path: req.originalUrl,
    method: req.method,
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("❌ Server error:", err);
  res.status(err.status || 500).json({
    message: "Internal server error",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Something went wrong",
  });
});

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log("\n🚀 ================================");
  console.log(`   Server running on port ${PORT}`);
  console.log("🚀 ================================");
  console.log(`📡 API: http://localhost:${PORT}/api`);
  console.log(`🎁 Referrals: http://localhost:${PORT}/api/referrals`);
  console.log(`👤 Users: http://localhost:${PORT}/api/users`);
  console.log(`🔐 Auth: http://localhost:${PORT}/api/auth`);
  console.log(`🛒 Products: http://localhost:${PORT}/api/products`);
  console.log(`📦 Orders: http://localhost:${PORT}/api/orders`);
  console.log("================================\n");
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Promise Rejection:", err);
  server.close(() => process.exit(1));
});

module.exports = app;
