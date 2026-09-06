import mongoose from "mongoose";

const connectDB = async () => {
  const url =
    process.env.MONGODB_URL || "mongodb://localhost:27017/taskpilot";

  try {
    await mongoose.connect(url, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    if (process.env.NODE_ENV !== "production") {
      console.log("MongoDB connected");
    }
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};

export default connectDB;
