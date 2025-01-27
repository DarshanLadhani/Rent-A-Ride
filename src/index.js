// Importing dependencies
import { connectDB } from "./db/connection.db.js";
import dotenv from "dotenv"


// Environment variable initialize
dotenv.config({
    path : "./env"
})

connectDB()