import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "Please enter Name"]
    },
    photo:{
        type: String,
        required: [true ,"Please give Product Photo"]
    },
    price:{
        type: Number,
        required: [true , "Please enter the price"]
    },
    stock:{
        type: Number,
        required: [true, "Please enter the stock"]

    },
    category:{
        type: String,
        required: [true, "Please enter the category"]
    }  
},{
    timestamps: true
})

export const Product = mongoose.model("Product", productSchema)
