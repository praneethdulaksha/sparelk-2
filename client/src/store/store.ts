import { configureStore } from "@reduxjs/toolkit";
import userReducer from '../reducers/userSlice';
import cartReducer from '../reducers/cartSlice';

const store = configureStore({
    reducer: {
        user: userReducer,
        cart: cartReducer,
    }
})

export default store;