import { createSlice } from "@reduxjs/toolkit";

type User = {
    _id: string;
    address: string;
    store: string;
    creditCard: string;
}

type TUserInitialState = {
    loading: boolean;
    isUserLoggedIn: boolean;
    previousPage: string;
    user: User | null;
    error: string | null;
}

const initialState: TUserInitialState = {
    loading: false,
    isUserLoggedIn: false,
    previousPage: '/',
    user: null,
    error: null,
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        updateUser: (state, action) => {
            state.user = action.payload;
        },
        setPreviosPage: (state, action) => {
            state.previousPage = action.payload;
        },
        setAddress: (state, action) => {
            if(state.user) state.user.address = action.payload;
        },
        setStore: (state, action) => {
            if(state.user) state.user.store = action.payload;
        },
        setCreditCard: (state, action) => {
            if(state.user) state.user.creditCard = action.payload;
        },
        logout: (state) => {
            state.loading = false;
            state.isUserLoggedIn = false;
            state.error = null;
            state.user = null;
        },
    }
})

export default userSlice.reducer;
export const {logout,updateUser, setPreviosPage, setAddress, setStore, setCreditCard} = userSlice.actions;