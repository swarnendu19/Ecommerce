import express from "express";  
import NodeCache from "node-cache" 
import  bodyParser from "body-parser"

const app = express();  

  
export const myCache = new NodeCache

app.use(bodyParser.json());  
app.use(bodyParser.urlencoded({ extended: true }));  
app.use(express.json())

app.get("/", (req, res) => { 
  res.send("API is working with api/v1");  
});


import userRoute from "./routes/user.js"; 
import orderRoute from "./routes/order.js"
import productRoute from "./routes/product.js" 

app.use("/api/v1/user", userRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/product", productRoute)

app.use("/uploads", express.static("uploads"))

export {app}