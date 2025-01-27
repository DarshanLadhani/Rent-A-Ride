// Dependencies
import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

// Function for database connection
export const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`MONGODB CONNECTED !! DB HOST : ${connectionInstance.connection.host}`)
    } catch (error) {
        console.error("MONGODB CONNECTION FAILED : " , error)
        process.exit(1) // Process exit due to error
    }
}