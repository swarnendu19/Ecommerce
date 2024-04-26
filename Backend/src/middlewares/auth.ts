import { User } from "../models/user.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";



export const adminOnly = asyncHandler(
    async(req, res, next)=>{
        const {id} = req.query;

        if(!id) {
            throw new ApiError(401, "Bhai Login Kar le");
        }

        const user = await User.findById(id)
        if(!user) throw new ApiError(401, "Fake Id ku de raha")

        if(user.role !== "admin")
        throw new ApiError(403, "Aukat nahi hai Admin hone ki");

        next();
    }
)