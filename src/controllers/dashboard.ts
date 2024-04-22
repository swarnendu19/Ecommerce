import { myCache } from "../app.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getDashboardStats = asyncHandler(
    async(req, res)=>{
        let stats = {}

        const key = "admin-stats";

        if(myCache.has(key)) stats = JSON.parse(myCache.get(key) as string)
        else {
            const today = new Date();
            const sixMonthAgo = new Date();
            sixMonthAgo.setMonth(sixMonthAgo.getMonth()-6);

            const thisMonth ={
                start: new Date(today.getFullYear(), today.getMonth(), 1),
                end: today,
            }

            const lastMonth ={
                start: new Date(today.getFullYear(), today.getMonth()-1, 1),
                end:  new Date(today.getFullYear(), today.getMonth(), 0),  
            }
        }
    }
)