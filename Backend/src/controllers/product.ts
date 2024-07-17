import { Product } from "../models/product.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Request } from "express";
import { findAverageRatings, invalidateCache } from "../utils/features.js";
import { BaseQuery, NewProductRequestBody, SearchRequestQuery } from "../types/types.js";
import { redis, redisTTL } from "../app.js";
import { deleteFromCloudinary, uploadToCloudinary } from "../utils/cloudinary.js";
import { Review } from "../models/review.js";
import { User } from "../models/user.js";

export const getlatestProducts = asyncHandler(async (req, res, next) => {
    let products;
    
    products = await redis.get("latest-products")
    if (products)
      products = JSON.parse(products);
    else {
      products = await Product.find({}).sort({ createdAt: -1 }).limit(5);
      await redis.setex("latest-products", redisTTL, JSON.stringify(products));
    }
  
    return res.status(200).json({
      success: true,
      products,
    });
  });

  export const getAllCategories = asyncHandler(async (req, res, next) => {
    let categories;
  
    categories = await redis.get("categories");
    if (categories)
      categories = JSON.parse(categories);
    else {
      categories = await Product.distinct("category");
      await redis.setex("categories", redisTTL, JSON.stringify(categories));
    }
  
    return res.status(200).json({
      success: true,
      categories,
    });
  });

  export const getAdminProducts = asyncHandler(async (req, res, next) => {
    let products;

    products = await redis.get("all-products");

   if (products) products = JSON.parse(products);
  else {
    products = await Product.find({});
    await redis.setex("all-products", redisTTL, JSON.stringify(products));
  }

    return res.status(200).json({
      success: true,
      products,
    });
  });

  export const getSingleProduct = asyncHandler(async (req, res, next) => {
    let product;
    const id = req.params.id;
    const key = `product-${id}`;
    product = await redis.get(key);

    if (product) product = JSON.parse(product);
    else {
      product = await Product.findById(id);
  
      if (!product) throw new ApiError(404,"Product Not Found");
  
      await redis.setex(key, redisTTL, JSON.stringify(product));
    }
  
    return res.status(200).json({
      success: true,
      product,
    });
  });

  export const newProduct = asyncHandler(
    async(req: Request<{}, {}, NewProductRequestBody>, res, next)=>{
      const { name, price, stock, category, description } = req.body;
      const photos = req.files as Express.Multer.File[] | undefined;
          
    // Validate photo upload
    if (!photos || photos.length === 0) {
      throw new ApiError(400, "Please add at least one photo");
    }
      
          if (photos.length > 5)
            throw new ApiError(400,"You can only upload 5 Photos");

        if( !name || !price || !stock || !category){
            throw new ApiError(400, "Please Enter all Fields")
        }
        const photosURL = await uploadToCloudinary(photos);        
        await Product.create({
            name, 
            price,
            description,
            stock,
            category: category.toLowerCase(),
            photo: photosURL,
        })

        await invalidateCache({product: true, admin: true})
        
        return res.status(201).json({
            success: true,
            message: "Product Created Successfully"
        })

    }
  )

export const updateProduct = asyncHandler(
  async(req: Request, res)=>{
    const { id } = req.params;
  const { name, price, stock, category, description } = req.body;
  const photos = req.files as Express.Multer.File[] | undefined;

  const product = await Product.findById(id);

  if (!product) throw new ApiError(400,"Product Not Found");

  if (photos && photos.length > 0) {
    const photosURL = await uploadToCloudinary(photos);

    const ids = product.photos.map((photo) => photo.public_id);

    await deleteFromCloudinary(ids);

      // Use Mongoose's `set` method to properly update the DocumentArray
      product.set({ photos: photosURL });
  }

  if (name) product.name = name;
  if (price) product.price = price;
  if (stock) product.stock = stock;
  if (category) product.category = category;
  if (description) product.description = description;

  await product.save();

  await invalidateCache({
    product: true,
    productId: String(product._id),
    admin: true,
  });

  return res.status(200).json({
    success: true,
    message: "Product Updated Successfully",
  });
  }
)


export const deleteProduct = asyncHandler(
  async(req, res)=>{
    const product = await Product.findById(req.params.id);
    if(!product) throw new ApiError(404, "Product Not found")

    const ids = product.photos.map((photo) => photo.public_id);
    
    await deleteFromCloudinary(ids);

    await product.deleteOne();

    invalidateCache({
      product: true,
      productId: String(product._id),
      admin: true
    })
    return res.status(200).json({
      success: true,
      message: "Product Deleted Successfully",
    });
  }
)


export const getAllProducts = asyncHandler(
  async(req: Request<{}, {}, {}, SearchRequestQuery>, res)=>{
    const { search, sort, category, price } = req.query;

    const page = Number(req.query.page) || 1;

    const key = `products-${search}-${sort}-${category}-${price}-${page}`;

    let products;
    let totalPage;

    const cachedData = await redis.get(key);
    if (cachedData) {
      const data = JSON.parse(cachedData);
      totalPage = data.totalPage;
      products = data.products;
    } else {
      // 1,2,3,4,5,6,7,8
      // 9,10,11,12,13,14,15,16
      // 17,18,19,20,21,22,23,24
      const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;
      const skip = (page - 1) * limit;

      const baseQuery: BaseQuery = {};

      if (search)
        baseQuery.name = {
          $regex: search,
          $options: "i",
        };

      if (price)
        baseQuery.price = {
          $lte: Number(price),
        };

      if (category) baseQuery.category = category;

      const productsPromise = Product.find(baseQuery)
        .sort(sort && { price: sort === "asc" ? 1 : -1 })
        .limit(limit)
        .skip(skip);

      const [productsFetched, filteredOnlyProduct] = await Promise.all([
        productsPromise,
        Product.find(baseQuery),
      ]);

      products = productsFetched;
      totalPage = Math.ceil(filteredOnlyProduct.length / limit);

      await redis.setex(key, 30, JSON.stringify({ products, totalPage }));
    }

    return res.status(200).json({
      success: true,
      products,
      totalPage,
    });
  }
)


export const allReviewsOfProduct = asyncHandler(async (req, res, next) => {
  let reviews;
  const key = `reviews-${req.params.id}`;

  reviews = await redis.get(key);

  if (reviews) reviews = JSON.parse(reviews);
  else {
    reviews = await Review.find({
      product: req.params.id,
    })
      .populate("user", "name photo")
      .sort({ updatedAt: -1 });

    await redis.setex(key, redisTTL, JSON.stringify(reviews));
  }

  return res.status(200).json({
    success: true,
    reviews,
  });
});

export const newReview = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.query.id);

  if (!user) return next(new ApiError(404,"Not Logged In"));

  const product = await Product.findById(req.params.id);
  if (!product) return next(new ApiError(404,"Product Not Found"));

  const { comment, rating } = req.body;

  const alreadyReviewed = await Review.findOne({
    user: user._id,
    product: product._id,
  });

  if (alreadyReviewed) {
    alreadyReviewed.comment = comment;
    alreadyReviewed.rating = rating;

    await alreadyReviewed.save();
  } else {
    await Review.create({
      comment,
      rating,
      user: user._id,
      product: product._id,
    });
  }

  const { ratings, numOfReviews } = await findAverageRatings(product._id);

  product.ratings = ratings;
  product.numOfReviews = numOfReviews;

  await product.save();

  await invalidateCache({
    product: true,
    productId: String(product._id),
    admin: true,
    review: true,
  });

  return res.status(alreadyReviewed ? 200 : 201).json({
    success: true,
    message: alreadyReviewed ? "Review Update" : "Review Added",
  });
});

export const deleteReview = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.query.id);

  if (!user) return next(new ApiError(404,"Not Logged In"));

  const review = await Review.findById(req.params.id);
  if (!review) return next(new ApiError(404,"Review Not Found"));

  const isAuthenticUser = review.user.toString() === user._id.toString();

  if (!isAuthenticUser) return next(new ApiError(401,"Not Authorized"));

  await review.deleteOne();
  
  const product = await Product.findById(review.product);

  if (!product) return next(new ApiError(404,"Product Not Found"));

  const { ratings, numOfReviews } = await findAverageRatings(product._id);

  product.ratings = ratings;
  product.numOfReviews = numOfReviews;

  await product.save();

  await invalidateCache({
    product: true,
    productId: String(product._id),
    admin: true,
  });

  return res.status(200).json({
    success: true,
    message: "Review Deleted",
  });
});