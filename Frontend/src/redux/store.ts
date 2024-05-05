import { configureStore } from "@reduxjs/toolkit";
import { userAPI } from "./api/user";

export const server = import.meta.env.VITE_SERVER

export const store = configureStore({
    reducer: {
        [userAPI.reducerPath]: userAPI.reducer,
    },
    middleware: (mid)=> [...mid() ,userAPI.middleware],
})