// src/db/index.js
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.DB_NAME,   // ✅ use env value
    });
    console.log(
      "✅ Connected to DB successfully :",
      connectionInstance.connection.host
    );
    return connectionInstance;
  } catch (err) {
    console.error("❌ Error in connecting to DB :", err);
    throw err;
  }
};

export default connectDB;
