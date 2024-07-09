import {Request, Response, NextFunction } from "express-serve-static-core";
import { NewUserRequestBody } from "../types/types.js";
import { User } from "../models/user.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

//Register User
export const newUser = asyncHandler(
    async (
        req: Request<{}, {}, NewUserRequestBody>,
        res: Response) =>{
        const {name, email, photo, gender, _id, dob} = req.body;
        let user = await User.findById(_id);

        if(user) 
        return res.status(200)
                  .json({
                    success: true,
                    message: `Welcome , ${user.name}`,
                  })

        if (!_id || !name || !email || !photo || !gender || !dob) {
                    throw new ApiError(400, "All fields are required")
                }

        user = await User.create({
            name, 
            email,
            photo,
            gender,
            _id,
            dob: new Date(dob),
        });
        
        return res.status(201)
                  .json({
                    success: true,
                    message: `Welcome, ${user.name}`,
                  })   
    }
);


export const getAllUsers = asyncHandler(
    async(req, res, next)=>{
        const users = await User.find({});

        return res.status(200).json({
            success: true,
            users,
        })
    }
)

export const getUser = asyncHandler(
    async(req, res, next)=>{
        const id = req.params.id;
        const user = await User.findById(id);

        if(!user) {
            throw new ApiError( 400, "Invalid Id")
        }
        return res.status(200)
                  .json({
                    success: true,
                    user
                  })
    }
)


export const deleteUser = asyncHandler(
    async(req, res, next) =>{
        const id = req.params.id;
        const user = await User.findById(id);

        if(!user) {
            throw new ApiError( 400, "Invalid Id")
        }
        await user.deleteOne();
        return res.status(200)
        .json({
          success: true,
          message: "User deleted successfully"
        })
    }
)

