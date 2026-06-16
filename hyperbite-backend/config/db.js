const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("[DB] FATAL: MONGO_URI is not defined in environment");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log("[DB] MongoDB connected successfully");
  } catch (err) {
    console.error("[DB] MongoDB connection failed:", err.message);
    process.exit(1);
  }

  mongoose.connection.on("error", (err) => {
    console.error("[DB] MongoDB runtime error:", err.message);
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("[DB] MongoDB disconnected");
  });
};

module.exports = connectDB;
