import mongoose from "mongoose";

const url = process.env.MONGODB_URL || "mongodb://localhost:27017/taskpilot"

const connectDB = async () =>
{
    try
    {
        await mongoose.connect(url);
        console.log("Connected Database");
    }
    catch(err)
    {
        console.log("Failed to connect to database", err.message);
        process.exit(1);
    }
}

export default connectDB;