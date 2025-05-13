// filepath: c:\LOCAL_PROJECTS\REACT\MULTI_ECOMMERCE\multi-ecommerce\src\test-db-connection.ts
import "dotenv/config";
import mongoose from "mongoose";

const uri = process.env.DATABASE_URI || "your-mongodb-uri-here";

async function testConnection() {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB successfully!");
    mongoose.connection.close();
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
  }
}

testConnection();
