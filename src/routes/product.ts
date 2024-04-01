import express from "express"
import { adminOnly } from "../middlewares/ auth.js";
import { getAdminProducts, getAllCategories, getlatestProducts, newProduct } from "../controllers/product.js";

const app = express.Router();

// routes  - /api/v1/product/new
app.post("/new", adminOnly, newProduct)

//routes- /api/v1/product/all
app.get("/all", getAdminProducts)

//routes- /api/v1/product/latest
app.get("/latest" , getlatestProducts)

//routes - api/v1/product/categories
app.get("/categories", getAllCategories)

app

export default app;