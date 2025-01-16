import { createSlice } from "@reduxjs/toolkit";

type TCartInitialState = {
    userId: null | string,
    cartId: null | string,
    itemsCount: number,
    cartItems: any[],
}

const initialState: TCartInitialState = {
    itemsCount: 0,
    cartItems: [],
    cartId: null,
    userId: null,
}

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        setUserId: (state, action) => {
            state.userId = action.payload
        },
        setCartId: (state, action) => {
            state.cartId = action.payload
        },
        addToCart: (state, action) => {
            state.cartItems = action.payload
            state.itemsCount = action.payload.length
        },
        addItemToCart: (state, action) => {
            let isHave = false;
            state.cartItems.map(item => {
                if (item.itemId === action.payload.itemId) {
                    item.qty += action.payload.qty
                    isHave = true;
                    return item
                }
            })
            if(!isHave){
                state.cartItems.push(action.payload)
                state.itemsCount++
            }
        },
        removeFromCart: (state, action) => {
            state.cartItems = state.cartItems.filter(item => item.itemId !== action.payload)
            state.itemsCount = state.cartItems.length;
        },
        clearCart: state => {
            state.cartItems = []
            state.itemsCount = 0
        },
        updateCartItem: (state, action) => {
            state.cartItems = state.cartItems.map(item => {
                if (item._id === action.payload._id) {
                    return action.payload
                } else {
                    return item
                }
            })
        }
    },
});

export default cartSlice.reducer;
export const {setUserId, setCartId, addToCart, addItemToCart, removeFromCart, clearCart, updateCartItem } = cartSlice.actions;