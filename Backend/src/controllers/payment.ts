import { Coupon } from "../models/coupon.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { stripe } from "../app.js";


export const createPaymentIntent = asyncHandler(
    async(req, res) =>{
        const {amount} = req.body;

        if(!amount) throw new ApiError(400, "Please enter the amount");

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Number(amount) * 100,
            currency: "INR",
        });
        return res.status(201).json({
            success: true,
            clientSecret: paymentIntent.client_secret,
        })
    }
)


export const newCoupon = asyncHandler(
    async(req, res)=>{
        const {code, amount} = req.body;

        if(!code || !amount)
         throw new ApiError(400, "Please Enter both Coupon and Amount");

        await Coupon.create({code: code, amount});
        
        return res.status(201).json({
            success: true,
            message: `Coupon ${code } created successfully`,
        })
    }
)

export const applyDiscount = asyncHandler(
    async(req, res) =>{
        const {coupon } = req.query;
        const discount = await Coupon.findOne({code: coupon});

        if(!discount) throw new ApiError(400, " Invalid Coupon code");

        return res.status(200).json({
            success: true,
            discount: discount.amount,

        })
    }
)

export const allCoupons =asyncHandler(
    async(req, res)=>{
        const coupons = await Coupon.find({});

        return res.status(200).json({
            success: true,
            coupons
        })
    }
)

export const getCoupon = asyncHandler(
    async(req, res)=>{
        const {id} = req.params;
        const coupon = await Coupon.findById(id);
        if(!coupon) throw new ApiError(400, "Invalid Coupon ID");
        return res.status(200).json({
            success: true,
            coupon,
        })
    }
)

export const updateCoupon = asyncHandler(
    async(req, res)=>{
        const {id} = req.params;
        const {code, amount } = req.body;
        const coupon  = await Coupon.findById(id);
        
        if(!coupon) throw new ApiError(400, "Invalid Coupon ID");
        if(code) coupon.code = code;
        if(amount) coupon.amount = amount;
        await coupon.save();
        return res.status(200).json({
            success: true,
            message:`Coupon ${coupon.code} updated successfully`
        })    }
)

export const deleteCoupon = asyncHandler(
    async(req, res)=>{
        const {id} = req.params;
        const coupon = await Coupon.findByIdAndDelete(id);

        if(!coupon) throw new ApiError(400, " Invalid Coupon ID");

        return res.status(200).json({
            success: true,
            message: `Coupon ${coupon.code} Deleted Successfully`
        })
    }
)