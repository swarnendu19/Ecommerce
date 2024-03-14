import { asyncHandler } from "../utils/asyncHandler.js"
import { myCache } from "../app.js";
import { Order } from "../models/order.js";
import { ApiError } from "../utils/ApiError.js";
import { reduceStock } from "../utils/features.js";
import { invalidateCache } from "../utils/features.js"; 

export const myOrders = asyncHandler(
    async(req, res) =>{
        const {id: user} = req.query;
        const key = `my-ordes-${user}`

        let orders = [];

        if(myCache.has(key)) orders = JSON.parse(myCache.get(key) as string);

        else{
            orders = await Order.find({user});
            myCache.set(key, JSON.stringify(orders));
        }

        return res.status(200).json({
            succss: true,
            orders,
        })
    }
)


export const allOrders = asyncHandler(
    async(req, res) =>{
        const key = `all-orders`;
        let orders = [];

        if(myCache.has(key)) orders = JSON.parse(myCache.get(key) as string);

        else{
            orders = await Order.find().populate("user", "name");
            myCache.set(key, JSON.stringify(orders));
        }

        return res.status(200).json({
            succss: true,
            orders,
        })
    }
)

export const getSingleOrder = asyncHandler(
    async(req, res)=>{
        const {id} = req.params;
        const key = `order-${id}`

        let order;

        if(myCache.has(key)) order = JSON.parse(myCache.get(key) as string)
        else{
          order = await Order.findById(id).populate("user","name");

        if(!order) throw new ApiError(400, "Order not found");

        myCache.set(key, JSON.stringify(order));
        }
        return res.status(200).json({
            success: true,
            order
        })
    }
)

export const newOrder = asyncHandler(
    async(req,res,next)=>{
        const {
            shippingInfo,
            orderItems,
            subtotal,
            tax,
            user,
            shippingCharges,
            discount,
            total
        } = req.body ;

        if(!shippingInfo || !orderItems || !user || !subtotal || !tax || !total) 
           throw new ApiError(400, "Abe sare field dal de")

        const order = await Order.create({
            shippingInfo,
            orderItems,

            user,
            subtotal,
            tax,
            shippingCharges,
            discount,
            total,
        })   

        await reduceStock(orderItems);

        invalidateCache({
            product: true,
            order: true,
            admin: true,
            userId: user,
            productId: order.orderItems.map((i) => String(i.productId)),
          });
    }
)