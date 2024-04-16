import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createPaymentIntent = asyncHandler(
    async(req, res) =>{
        const {amount} = req.body;

        if(!amount) throw new ApiError(400, "Please enter the amount");

        const paymentIntent = await paymentIntent.create({
            amount: Number(amount) * 100,
            currency: "INR",
        });
        return res.status(201).json({
            success: true,
            clientSecret: paymentIntent.client_secret,
        })
    }
)