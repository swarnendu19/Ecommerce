import express, { Router } from "express"
import { deleteUser, getAllUsers, getUser, newUser } from "../controllers/user.js";
import { adminOnly } from "../middlewares/auth.js";


 
const router= Router();

router.route("/").post(
    
)

// Route -- api/v1/user/new
router.route("/new").post(newUser)

//Route - api/v1/user/all
router.route("/all").get(adminOnly, getAllUsers)

//Route - api/v1/user/dynamicID
router.route("/:id").get(getUser).delete(adminOnly,deleteUser);


export default router;