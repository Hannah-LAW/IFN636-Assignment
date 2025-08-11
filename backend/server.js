
// config/db.js
const mongoose = require("mongoose");

// 令strictQuery行為與未來版本兼容
mongoose.set('strictQuery', false);

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB URI:", process.env.MONGO_URI);  // 測試用
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
