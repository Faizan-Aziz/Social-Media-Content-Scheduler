import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const databaseconnection = mongoose.connect(process.env.MONGODB_URI )
.then(() => {
    console.log("Database connected successfully");
}).catch((err) => {
    console.log("Database connection error:", err);
});

export default databaseconnection;