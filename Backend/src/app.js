// Importing dependencies
import express, { json } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// Initializing app
export const app = express();

// Enable CORS
app.use(cors({
    origin : process.env.CORS_ORIGIN, // Allow requests from the specified frontend domain defined in the environment variable.
    credentials : true, // Allow cookies and credentials to be sent
}));

// Enable JSON
app.use(json({limit : "1mb"})); // Here, the limit is set to 1 megabyte. If a payload exceeds this size, the server will reject the request.

// Enable Data from URL
app.use(express.urlencoded({extended : true , limit : "1mb"})) // Middleware to parse URL-encoded data, allowing nested objects and limiting payload size to 1MB for security.

// Serving public files
app.use(express.static("public")) // // Middleware to serve static files (HTML, CSS, JavaScript, etc.) from the 'public' directory.

app.use(cookieParser())
// Middleware to parse cookies from incoming requests and make them available in req.cookies.
// This allows you to add, remove, update, and use cookies for user sessions, preferences, etc.

import userRoute from "./routes/user.route.js"
import bikeRoute from "./routes/bike.route.js"
import bookingRoute from "./routes/booking.route.js"
import paymentRoute from "./routes/payment.route.js"

app.use("/api/v1/users" , userRoute)
app.use("/api/v1/bikes" , bikeRoute)
app.use("/api/v1/booking" , bookingRoute)
app.use("/api/v1/payment" , paymentRoute)
