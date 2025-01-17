import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../reducers/userSlice";
import cartReducer from "../reducers/cartSlice";

// Configure the Redux store
const store = configureStore({
    reducer: {
        user: userReducer,
        cart: cartReducer,
    },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
