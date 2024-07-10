import express from "express";  
import  bodyParser from "body-parser"
import morgan from "morgan";
import cors from "cors"
import Stripe from "stripe";
import { connectRedis } from "./utils/features.js";

const app = express();  

  

const stripeKey = process.env.STRIPE_KEY || "";
export const stripe = new Stripe(stripeKey);

const redisURI = process.env.REDIS_URI || "";
export const redisTTL = process.env.REDIS_TTL || 60 * 60 * 4;
export const redis = connectRedis(redisURI);


app.use(bodyParser.json());  
app.use(bodyParser.urlencoded({ extended: true }));  
app.use(express.json())
app.use(morgan("dev"))
app.use(cors());

app.get("/", (req, res) => { 
  res.send("API is working with api/v1");  
});


import userRoute from "./routes/user.js"; 
import productRoute from "./routes/product.js" 
import orderRoute from "./routes/order.js"
import paymentRoute from "./routes/payment.js"
import dashboardRoute from "./routes/dashboard.js"

app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute)
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/payment", paymentRoute)
app.use("/api/v1/dashboard", dashboardRoute)

app.use("/uploads", express.static("uploads"))

export {app}