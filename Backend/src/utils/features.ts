import { Product } from "../models/product.js";
import { ApiError } from "./ApiError.js";
import { OrderItemType } from "../types/types.js";
import { InvalidateCacheProps } from "../types/types.js";
import { redis } from "../app.js";
import { Document } from "mongoose";
import { Redis } from "ioredis";
import { Review } from "../models/review.js";
import mongoose from "mongoose";




export const findAverageRatings = async (
  productId: mongoose.Types.ObjectId
) => {
  let totalRating = 0;

  const reviews = await Review.find({ product: productId });
  reviews.forEach((review) => {
    totalRating += review.rating;
  });

  const averateRating = Math.floor(totalRating / reviews.length) || 0;

  return {
    numOfReviews: reviews.length,
    ratings: averateRating,
  };
};


export const reduceStock = async(orderItems : OrderItemType[])=>{
    for(let i = 0; i< orderItems.length; i++){
        const order = orderItems[i];
        const product = await Product.findById(order.productId);
        if(!product) throw new ApiError(400,"Product not found");

        product.stock -=order.quantity;
        await product.save();
    }
}

export const connectRedis =(redisURI: string)=>{
  const redis = new Redis(redisURI);
  redis.on("connect", ()=> console.log("Reids Connected"));
  redis.on("error", (e)=> console.log(e));
  return redis;
}

export const invalidateCache = async ({
  product,
  order,
  admin,
  review,
  userId,
  orderId,
  productId,
}: InvalidateCacheProps) => {
  if (review) {
    await redis.del([`reviews-${productId}`]);
  }

  if (product) {
    const productKeys: string[] = [
      "latest-products",
      "categories",
      "all-products",
    ];

    if (typeof productId === "string") productKeys.push(`product-${productId}`);

    if (typeof productId === "object")
      productId.forEach((i) => productKeys.push(`product-${i}`));

    await redis.del(productKeys);
  }
  if (order) {
    const ordersKeys: string[] = [
      "all-orders",
      `my-orders-${userId}`,
      `order-${orderId}`,
    ];

    await redis.del(ordersKeys);
  }
  if (admin) {
    await redis.del([
      "admin-stats",
      "admin-pie-charts",
      "admin-bar-charts",
      "admin-line-charts",
    ]);
  }
};



export const calculatePercentage = (thisMonth: number, lastMonth: number) => {
    if (lastMonth === 0) return thisMonth * 100;
    const percent = (thisMonth / lastMonth) * 100;
    return Number(percent.toFixed(0));
  };
  
  export const getInventories = async ({
    categories,
    productsCount,
  }: {
    categories: string[];
    productsCount: number;
  }) => {
    const categoriesCountPromise = categories.map((category) =>
      Product.countDocuments({ category })
    );
  
    const categoriesCount = await Promise.all(categoriesCountPromise);
  
    const categoryCount: Record<string, number>[] = [];
  
    categories.forEach((category, i) => {
      categoryCount.push({
        [category]: Math.round((categoriesCount[i] / productsCount) * 100),
      });
    });
  
    return categoryCount;
  };
  
  interface MyDocument extends Document {
    _id: string | import('mongoose').Types.ObjectId;
    createdAt: Date;
    discount?: number;
    total?: number;
  }
  type FuncProps = {
    length: number;
    docArr: MyDocument[];
    today: Date;
    property?: "discount" | "total";
  };
  
  export const getChartData = ({
    length,
    docArr,
    today,
    property,
  }: FuncProps) => {
    const data: number[] = new Array(length).fill(0);
  
    docArr.forEach((i) => {
      const creationDate = i.createdAt;
      const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;
  
      if (monthDiff < length) {
        if (property) {
          data[length - monthDiff - 1] += i[property]!;
        } else {
          data[length - monthDiff - 1] += 1;
        }
      }
    });
  
    return data;
  };