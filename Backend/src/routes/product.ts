import express from "express"
import { adminOnly } from "../middlewares/auth.js";
import { allReviewsOfProduct, deleteProduct, deleteReview, getAdminProducts, getAllCategories, getAllProducts, getlatestProducts, getSingleProduct, newProduct, newReview, updateProduct } from "../controllers/product.js";
import { mutliUpload, singleUpload } from "../middlewares/multer.js";

const app = express.Router();

// routes  - /api/v1/product/new
app.post("/new", adminOnly, mutliUpload, newProduct)

//routes- /api/v1/product/all
app.get("/all", getAllProducts)

//routes- /api/v1/product/latest
app.get("/latest" , getlatestProducts)

//routes - api/v1/product/categories
app.get("/categories", getAllCategories)

app.get("/admin-products",  adminOnly, getAdminProducts)

app.route("/:id")
   .get(getSingleProduct)
   .put(adminOnly, mutliUpload , updateProduct)
   .delete(adminOnly, deleteProduct)

   app.get("/reviews/:id", allReviewsOfProduct);
   app.post("/review/new/:id", newReview);
   app.delete("/review/:id", deleteReview);
   

export default app;