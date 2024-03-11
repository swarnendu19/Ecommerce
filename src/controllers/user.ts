import {Request, Response, NextFunction } from "express-serve-static-core";
import { NewUserRequestBody } from "../types/types.js";
import { User } from "../models/user.js";

export const newUser = async (
    req: Request<NewUserRequestBody>,
    res: Response,
    next: NextFunction) =>{
        try {
            const {name, email, photo,gender, role, _id, dob} = req.body;
            const user = await User.create({
                name, 
                email, 
                photo,
                gender, 
                role, 
                _id, 
                dob
            })
            

            return res.status(200).json({
                success: true,
                message: `Welcome, ${user.name}`
            });
        } catch (error) {
            
        }
    }