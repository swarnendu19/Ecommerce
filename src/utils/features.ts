import { Product } from "../models/produc.js";
import { ApiError } from "./ApiError.js";
import { OrderItemType } from "../types/types.js";
import { InvalidateCacheProps } from "../types/types.js";

export const reduceStock = async(orderItems : OrderItemType[])=>{
    for(let i = 0; i< orderItems.length; i++){
        const order = orderItems[i];
        const product = await Product.findById(order.productId);
        if(!product) throw new ApiError(400,"Product not found");

        product.stock -=order.quantity;
        await product.save();
    }
}

export const invalidateCache = ({
    product, 
    order, 
    admin,
    userId,
    orderId,
    productId,

}:InvalidateCacheProps)=>{
    if(product){
        const productKeys: string[] = [
            "latest-products",
            "categories",
            "all-products",
        ];
        if(typeof productId === "string") productKeys.push(`product-${productId}`)
    }
}