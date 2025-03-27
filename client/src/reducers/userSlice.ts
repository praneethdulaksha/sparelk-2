import { createSlice } from "@reduxjs/toolkit";
import { TUser } from "../types";

type TUserInitialState = {
    loading: boolean;
    isUserAuthed: boolean;
    previousPage: string;
    user: TUser | null;
    error: string | null;
}

const initialState: TUserInitialState = {
    loading: false,
    isUserAuthed: false,
    previousPage: '/',
    user: null,
    error: null,
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state, action) => {
            state.isUserAuthed = true;
            state.error = null;
            state.user = action.payload;
            state.loading = false;
        },
        setUser: (state, action) => {
            state.user = action.payload
        },
        updateUser: (state, action) => {
            state.user = action.payload;
            localStorage.setItem('user', JSON.stringify(action.payload))
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
            localStorage.removeItem('user')
            localStorage.removeItem('cart')
            state.loading = false;
            state.isUserAuthed = false;
            state.error = null;
            state.user = null;
        },
    }
})

export default userSlice.reducer;
export const userActions = userSlice.actions;