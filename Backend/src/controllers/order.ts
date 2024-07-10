import { asyncHandler } from "../utils/asyncHandler.js"
import { Order } from "../models/order.js";
import { ApiError } from "../utils/ApiError.js";
import { reduceStock } from "../utils/features.js";
import { invalidateCache } from "../utils/features.js"; 
import { NewOrderRequestBody } from "../types/types.js";
import { Request } from "express";
import { redis, redisTTL } from "../app.js";

export const myOrders = asyncHandler(
    async(req, res) =>{
        const { id: user } = req.query;

        const key = `my-orders-${user}`;
      
        let orders;
      
        orders = await redis.get(key);
      
        if (orders) orders = JSON.parse(orders);
        else {
          orders = await Order.find({ user });
          await redis.setex(key, redisTTL, JSON.stringify(orders));
        }
        return res.status(200).json({
            success: true,
            orders,
        })
    }
)


export const allOrders = asyncHandler(
    async(req, res) =>{
        const key = `all-orders`;

        let orders;
      
        orders = await redis.get(key);
      
        if (orders) orders = JSON.parse(orders);
        else {
          orders = await Order.find().populate("user", "name");
          await redis.setex(key, redisTTL, JSON.stringify(orders));
        }

        return res.status(200).json({
            success: true,
            orders,
         })
    }
)

export const getSingleOrder = asyncHandler(
    async(req, res)=>{
        const { id } = req.params;
        const key = `order-${id}`;
      
        let order;
        order = await redis.get(key);
      
        if (order) order = JSON.parse(order);
        else {
          order = await Order.findById(id).populate("user", "name");
      
          if (!order) throw new ApiError( 404 ,"Order Not Found");
      
          await redis.setex(key, redisTTL, JSON.stringify(order));
        }
        return res.status(200).json({
            success: true,
            order
        })
    }
)

export const newOrder = asyncHandler(
    async(req: Request<{}, {}, NewOrderRequestBody>, res, next)=>{
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

        await invalidateCache({
            product: true,
            order: true,
            admin: true,
            userId: user,
            productId: order.orderItems.map((i) => String(i.productId)),
          });

          return res.status(200).json({
            success: true,
            message: "Order processed successfully" 
          })
    }
)

export const processOrder = asyncHandler(
    async(req,res)=>{
        const {id} = req.params;

        const order = await Order.findById(id);

        if(!order) throw new ApiError(404, "Oreder not found");

        switch(order.status){
            case "Processing":
                order.status = "Shipped";
                break;
            case "Shipped":
                order.status = "Delivered";
                break;
            default:
                order.status = "Delivered";
                break;

        }

        await order.save();

        await invalidateCache({
            product: false,
            order: true,
            admin: true,
            userId: order.user,
            orderId: String(order._id)
        })

        return res.status(200).json({
            success: true,
            message: "Order Processed Successfully"
        })
    }
)


export const deleteOrder = asyncHandler(
    async(req,res)=>{
        const {id} = req.params;
        const order = await Order.findById(id);
        if(!order) throw new ApiError(404, "Order not found");

        await order.deleteOne();

        await invalidateCache({
            product: false,
            order: true,
            admin: true,
            userId: order.user,
            orderId: String(order._id)
        })

        return res.status(200).json({
            success: true,
            message: "Order Deleted successfully"
        })
    }
)