import mongoose from "mongoose";
import { dbConfig } from "../config/db.config.js";

const dbConnection = async () => {
    try {
        await mongoose.connect(dbConfig);
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Database connection failed:", error.message);
        throw error;
    }
};

export default dbConnection;