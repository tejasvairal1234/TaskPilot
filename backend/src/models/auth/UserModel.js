import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your name"],
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Please provide password"],
    },
    photo: {
      type: String,
      default: "https://avatars.githubusercontent.com/u/19819005?v=4",
    },
    bio: {
      type: String,
      default: "I am a new user.",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timeseries: true, minimize: true },
);

const User = mongoose.model("User", userSchema);
export default User;
