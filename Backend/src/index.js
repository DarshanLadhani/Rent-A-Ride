// Importing dependencies
import { connectDB } from "./db/connection.db.js";
import dotenv from "dotenv"
import { app } from "./app.js";

// Environment variable initialize
dotenv.config({
    path : "./env"
})

// Calling the DB connection function
connectDB()
    .then(()=>{
        app.on("error" , (error)=>{
            console.log("Failed to start the app" , error)
        })

        app.listen(process.env.PORT , ()=>{
            console.log(`Server running at ${process.env.PORT}`);
        })
    })
    .catch((err)=>{
        console.error("MONGODB Connection Failed : " , err)
    })